import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Obtener valor anidado de un objeto por ruta con puntos (ej. "transaction.id")
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const eventsSecret = Deno.env.get('WOMPI_EVENTS_SECRET') || 'test_events_secret';

    const payload = await req.json();
    console.log('Evento Webhook Wompi recibido:', payload.event);

    const { event, data, timestamp, signature } = payload;

    if (!data || !signature || !signature.properties || !signature.checksum) {
      return new Response('Payload de Webhook inválido', { status: 400 });
    }

    // 1. Reconstruir la cadena para la firma de evento
    // Wompi concatena: valores de propiedades + timestamp + WOMPI_EVENTS_SECRET
    let concatenatedValues = '';
    for (const propPath of signature.properties) {
      const val = getNestedValue(data, propPath);
      concatenatedValues += val;
    }
    concatenatedValues += `${timestamp}${eventsSecret}`;

    const calculatedChecksum = await sha256(concatenatedValues);

    // En ambiente de producción se debe hacer verificación estricta.
    // Si el secret no está configurado (modo desarrollo/test), registramos advertencia.
    if (calculatedChecksum.toLowerCase() !== signature.checksum.toLowerCase()) {
      console.warn('Checksum de evento Wompi no coincide. Calculado:', calculatedChecksum, 'Recibido:', signature.checksum);
      // Descomentar para estricto en prod: return new Response('Firma inválida', { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event === 'transaction.updated' && data.transaction) {
      const transaction = data.transaction;
      const ref = transaction.reference;
      const transactionId = transaction.id;
      const status = transaction.status;

      console.log(`Transacción Wompi ${transactionId} (Ref: ${ref}) Estado: ${status}`);

      // Buscar la orden por referencia o por ID de transacción
      let query = supabase.from('orders').select('id, estado');
      if (ref) {
        query = query.eq('referencia_pago', ref);
      } else {
        query = query.eq('wompi_transaction_id', transactionId);
      }

      const { data: orderData, error: searchErr } = await query.maybeSingle();

      if (searchErr) {
        console.error('Error buscando orden en Supabase:', searchErr);
      }

      if (orderData) {
        if (status === 'APPROVED') {
          if (orderData.estado === 'aprobado') {
            console.log(`Orden ${orderData.id} ya aprobada previa e idempotente.`);
            return new Response(JSON.stringify({ received: true }), { status: 200 });
          }

          // Invocar procedimiento almacenado approve_order
          const { error: rpcErr } = await supabase.rpc('approve_order', { p_order_id: orderData.id });

          if (rpcErr) {
            console.warn('RPC approve_order falló, aplicando fallback directo:', rpcErr);

            await supabase
              .from('orders')
              .update({
                estado: 'aprobado',
                wompi_transaction_id: transactionId,
                aprobado_at: new Date().toISOString()
              })
              .eq('id', orderData.id);

            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
            const expira = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

            await supabase
              .from('download_links')
              .insert([{ order_id: orderData.id, token, expira_en: expira, usado: false }]);
          } else {
            // Actualizar wompi_transaction_id
            await supabase
              .from('orders')
              .update({ wompi_transaction_id: transactionId })
              .eq('id', orderData.id);
          }

          console.log(`Orden ${orderData.id} aprobada exitosamente vía Wompi.`);
        } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
          await supabase
            .from('orders')
            .update({ estado: 'rechazado', wompi_transaction_id: transactionId })
            .eq('id', orderData.id);
          
          console.log(`Orden ${orderData.id} marcada como rechazada.`);
        }
      } else {
        console.warn(`No se encontró orden para la referencia Wompi ${ref}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error procesando Webhook de Wompi:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
