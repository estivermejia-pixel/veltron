import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Función auxiliar para calcular SHA-256
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const wompiIntegritySecret = Deno.env.get('WOMPI_INTEGRITY_SECRET') || 'test_integrity_secret';
    const wompiPublicKey = Deno.env.get('VITE_WOMPI_PUBLIC_KEY') || Deno.env.get('WOMPI_PUBLIC_KEY') || 'pub_test_Q5y1F3gStopWompiPublicKey';

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { productId, amount, email, nombre, telefono } = await req.json();

    if (!productId || !amount || !email) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos (productId, amount, email)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar monto mínimo ($1.000 COP)
    const numericAmount = Math.max(1000, Math.round(Number(amount)));
    const amountInCents = numericAmount * 100;
    const currency = 'COP';

    // Generar referencia única (ej. WMP-839201)
    const refNum = Math.floor(100000 + Math.random() * 900000);
    const referencia_pago = `WMP-${refNum}`;

    // Firma de Integridad Wompi: SHA256(referencia + monto_en_centavos + moneda + WOMPI_INTEGRITY_SECRET)
    const integrityRaw = `${referencia_pago}${amountInCents}${currency}${wompiIntegritySecret}`;
    const integritySignature = await sha256(integrityRaw);

    // Registrar la orden en la base de datos Supabase en estado pendiente
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          product_id: productId,
          nombre_comprador: nombre || 'Comprador',
          email_comprador: email,
          telefono_comprador: telefono || '',
          referencia_pago,
          metodo_pago: 'wompi',
          estado: 'pendiente'
        }
      ])
      .select()
      .single();

    if (orderErr) {
      console.error('Error insertando orden Wompi en Supabase:', orderErr);
    }

    return new Response(
      JSON.stringify({
        referencia_pago,
        amountInCents,
        currency,
        publicKey: wompiPublicKey,
        integritySignature,
        orderId: orderData ? orderData.id : null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error creando transacción Wompi:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
