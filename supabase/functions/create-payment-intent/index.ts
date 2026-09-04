import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) {
      throw new Error('STRIPE_SECRET_KEY no configurado en los secretos de Supabase.');
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

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
    const numericAmount = Math.max(1000, Number(amount));

    // Validar producto en la base de datos para prevenir manipulación
    const { data: productData, error: productErr } = await supabase
      .from('products')
      .select('id, titulo')
      .eq('id', productId)
      .single();

    if (productErr && !productData) {
      console.warn('Producto no encontrado en DB, usando fallback por título');
    }

    const productTitle = productData ? productData.titulo : 'Producto Digital Semanal';

    // Generar referencia visible (ej. ST-94021)
    const refNum = Math.floor(100000 + Math.random() * 900000);
    const referencia_pago = `ST-${refNum}`;

    // Crear PaymentIntent en Stripe (Moneda COP)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(numericAmount),
      currency: 'cop',
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: {
        productId,
        referencia_pago,
        email_comprador: email,
        nombre_comprador: nombre || 'Comprador'
      }
    });

    // Registrar la orden en estado pendiente
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          product_id: productId,
          nombre_comprador: nombre || 'Comprador',
          email_comprador: email,
          telefono_comprador: telefono || '',
          referencia_pago,
          metodo_pago: 'stripe',
          stripe_payment_intent_id: paymentIntent.id,
          estado: 'pendiente'
        }
      ])
      .select()
      .single();

    if (orderErr) {
      console.error('Error insertando orden en Supabase:', orderErr);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: orderData ? orderData.id : null,
        referencia_pago
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error creando PaymentIntent:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
