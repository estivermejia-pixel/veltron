-- ==============================================================================
-- MIGRACIÓN: AUDITORÍA DE PAGOS, ALERTAS Y MOTOR DE CONCILIACIÓN AUTOMÁTICA
-- ==============================================================================

-- 1. TABLA: payment_audit_logs (Trazabilidad e historial de eventos de pago)
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,         -- 'wompi.webhook', 'bancolombia.receipt', 'manual.approval'
  provider TEXT NOT NULL,           -- 'wompi', 'bre-b', 'bancolombia'
  raw_payload JSONB NOT NULL,       -- Payload completo sin modificar
  signature_valid BOOLEAN NOT NULL DEFAULT true,
  monto_esperado NUMERIC(12, 2),
  monto_recibido NUMERIC(12, 2),
  estado_previo TEXT,
  estado_nuevo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexación para búsquedas rápidas por orden y proveedor
CREATE INDEX IF NOT EXISTS idx_audit_logs_order ON public.payment_audit_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_provider ON public.payment_audit_logs(provider);

-- 2. TABLA: payment_alerts (Salvaguardas y alertas de excepciones)
CREATE TABLE IF NOT EXISTS public.payment_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  severity TEXT CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')) DEFAULT 'WARNING',
  alert_type TEXT NOT NULL,         -- 'AMOUNT_MISMATCH', 'SIGNATURE_INVALID', 'TOKEN_GEN_FAILED', 'EMAIL_FAILED'
  message TEXT NOT NULL,
  payload JSONB,
  resuelto BOOLEAN DEFAULT FALSE,
  resuelto_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexación de alertas activas
CREATE INDEX IF NOT EXISTS idx_alerts_resuelto ON public.payment_alerts(resuelto);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lectura/escritura administrativa
CREATE POLICY "Admins pueden consultar audit logs"
  on public.payment_audit_logs FOR SELECT USING (public.is_admin() OR auth.uid() IS NULL);

CREATE POLICY "Inserción de audit logs permitida para servicio o webhook"
  on public.payment_audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins pueden consultar y actualizar alertas"
  on public.payment_alerts FOR ALL USING (public.is_admin() OR auth.uid() IS NULL);

CREATE POLICY "Inserción de alertas permitida para servicio o webhook"
  on public.payment_alerts FOR INSERT WITH CHECK (true);

-- 4. FUNCIÓN ALMACENADA: process_automated_approval
-- Concilia la orden, genera token de 48h y registra log de auditoría
CREATE OR REPLACE FUNCTION public.process_automated_approval(
  p_order_id UUID,
  p_provider TEXT,
  p_raw_payload JSONB,
  p_monto_recibido NUMERIC DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_product RECORD;
  v_token TEXT;
  v_expira TIMESTAMPTZ;
  v_link_id UUID;
  v_monto_esperado NUMERIC(12,2);
  v_estado_previo TEXT;
BEGIN
  -- 1. Obtener la orden existente
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;

  IF v_order.id IS NULL THEN
    RAISE EXCEPTION 'Orden no encontrada con ID: %', p_order_id;
  END IF;

  v_estado_previo := v_order.estado;

  -- 2. Si la orden ya estaba aprobada, retornar idempotente
  IF v_estado_previo = 'aprobado' THEN
    SELECT token INTO v_token FROM public.download_links WHERE order_id = p_order_id ORDER BY created_at DESC LIMIT 1;
    RETURN jsonb_build_object(
      'success', true,
      'idempotent', true,
      'order_id', p_order_id,
      'estado', 'aprobado',
      'token', v_token
    );
  END IF;

  -- 3. Obtener el precio del producto asociado para verificación de monto
  SELECT precio INTO v_product FROM public.products WHERE id = v_order.product_id;
  v_monto_esperado := COALESCE(v_product.precio, 0);

  -- 4. Validar Discrepancia de Monto (si se proporciona el monto recibido)
  IF p_monto_recibido IS NOT NULL AND p_monto_recibido < v_monto_esperado THEN
    -- Registrar alerta por monto insuficiente
    INSERT INTO public.payment_alerts (order_id, severity, alert_type, message, payload)
    VALUES (
      p_order_id,
      'CRITICAL',
      'AMOUNT_MISMATCH',
      format('Monto recibido (%s COP) menor al esperado (%s COP)', p_monto_recibido, v_monto_esperado),
      jsonb_build_object('monto_esperado', v_monto_esperado, 'monto_recibido', p_monto_recibido, 'payload', p_raw_payload)
    );

    -- Registrar audit log de fallo por monto
    INSERT INTO public.payment_audit_logs (
      order_id, event_type, provider, raw_payload, signature_valid,
      monto_esperado, monto_recibido, estado_previo, estado_nuevo
    ) VALUES (
      p_order_id, 'approval.rejected_amount', p_provider, p_raw_payload, true,
      v_monto_esperado, p_monto_recibido, v_estado_previo, 'monto_discrepante'
    );

    RETURN jsonb_build_object(
      'success', false,
      'error', 'AMOUNT_MISMATCH',
      'message', format('El monto recibido (%s COP) no satisface el mínimo requerido (%s COP)', p_monto_recibido, v_monto_esperado)
    );
  END IF;

  -- 5. Actualizar estado de la orden a 'aprobado'
  UPDATE public.orders
  SET estado = 'aprobado',
      aprobado_at = NOW()
  WHERE id = p_order_id;

  -- 6. Generar token único de descarga con vigencia de 48 horas
  v_expira := NOW() + INTERVAL '48 hours';
  v_token := encode(gen_random_bytes(24), 'hex');

  INSERT INTO public.download_links (order_id, token, expira_en, usado)
  VALUES (p_order_id, v_token, v_expira, FALSE)
  RETURNING id INTO v_link_id;

  -- 7. Registrar en la tabla de auditoría inmutable
  INSERT INTO public.payment_audit_logs (
    order_id, event_type, provider, raw_payload, signature_valid,
    monto_esperado, monto_recibido, estado_previo, estado_nuevo
  ) VALUES (
    p_order_id, 'approval.success', p_provider, p_raw_payload, true,
    v_monto_esperado, COALESCE(p_monto_recibido, v_monto_esperado), v_estado_previo, 'aprobado'
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'estado', 'aprobado',
    'token', v_token,
    'expira_en', v_expira
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
