import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!stripeSecret || !webhookSecret) {
    console.error('Faltan secretos de Stripe en Supabase (STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET)');
    return new Response('Configuración incompleta', { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Falta firma stripe-signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const bodyText = await req.text();
    event = await stripe.webhooks.constructEventAsync(bodyText, signature, webhookSecret);
  } catch (err) {
    console.error('Firma de Webhook no válida:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Escuchar eventos de aprobación de pago
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`PaymentIntent exitoso recibido: ${paymentIntent.id}`);

    // 1. Buscar la orden correspondiente por stripe_payment_intent_id o metadata
    const { data: orderData, error: searchErr } = await supabase
      .from('orders')
      .select('id, estado')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .maybeSingle();

    if (searchErr) {
      console.error('Error buscando orden para webhook:', searchErr);
    }

    if (orderData) {
      // Chequeo de idempotencia: si ya estaba aprobada, no duplicar token
      if (orderData.estado === 'aprobado') {
        console.log(`Orden ${orderData.id} ya fue aprobada previamente. Idempotencia verificada.`);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Invocar función RPC approve_order o actualizar directamente
      const { error: rpcErr } = await supabase.rpc('approve_order', { p_order_id: orderData.id });

      if (rpcErr) {
        console.warn('RPC approve_order falló o no existe, realizando actualización fallback:', rpcErr);
        
        await supabase
          .from('orders')
          .update({ estado: 'aprobado', aprobado_at: new Date().toISOString() })
          .eq('id', orderData.id);

        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expira = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

        await supabase
          .from('download_links')
          .insert([{ order_id: orderData.id, token, expira_en: expira, usado: false }]);
      }
    } else {
      console.warn(`No se encontró registro previo de orden para PaymentIntent ${paymentIntent.id}`);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`PaymentIntent fallido: ${paymentIntent.id}`);

    await supabase
      .from('orders')
      .update({ estado: 'rechazado' })
      .eq('stripe_payment_intent_id', paymentIntent.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});
