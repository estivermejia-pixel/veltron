import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const eventsSecret = Deno.env.get('WOMPI_EVENTS_SECRET') || '';
    const payload = await req.json();

    console.log('Evento Webhook Wompi recibido:', payload?.event);

    const { event, data, timestamp, signature } = payload || {};

    if (!data || !signature || !signature.properties || !signature.checksum) {
      return new Response(JSON.stringify({ error: 'Payload de Webhook inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Verificación Criptográfica de la Firma del Evento
    let concatenatedValues = '';
    for (const propPath of signature.properties) {
      const val = getNestedValue(data, propPath);
      concatenatedValues += val;
    }
    concatenatedValues += `${timestamp}${eventsSecret}`;

    const calculatedChecksum = await sha256(concatenatedValues);
    const isSignatureValid = calculatedChecksum.toLowerCase() === signature.checksum.toLowerCase();

    if (eventsSecret && !isSignatureValid) {
      console.error('Firma inválida de Webhook Wompi. Calculada:', calculatedChecksum, 'Recibida:', signature.checksum);

      await supabase.from('payment_alerts').insert([
        {
          severity: 'CRITICAL',
          alert_type: 'SIGNATURE_INVALID',
          message: 'Intento de webhook con firma inválida o alterada',
          payload: { received: signature.checksum, calculated: calculatedChecksum, raw: payload }
        }
      ]);

      return new Response(JSON.stringify({ error: 'Firma de webhook inválida' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Procesar evento transaction.updated
    if (event === 'transaction.updated' && data.transaction) {
      const transaction = data.transaction;
      const ref = transaction.reference;
      const transactionId = transaction.id;
      const status = transaction.status;
      const amountInCents = transaction.amount_in_cents || 0;
      const amountCop = amountInCents / 100;

      console.log(`Transacción Wompi ${transactionId} (Ref: ${ref}) Estado: ${status} Monto: ${amountCop} COP`);

      // Buscar orden por referencia o por transaction ID
      let query = supabase.from('orders').select('id, product_id, email_comprador, estado, products(titulo)');
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
          // Invocar procedimiento de conciliación automatizada process_automated_approval
          const { data: approvalResult, error: rpcErr } = await supabase.rpc('process_automated_approval', {
            p_order_id: orderData.id,
            p_provider: 'wompi',
            p_raw_payload: payload,
            p_monto_recibido: amountCop
          });

          if (rpcErr) {
            console.error('Error invocando RPC process_automated_approval:', rpcErr);

            await supabase.from('payment_alerts').insert([
              {
                order_id: orderData.id,
                severity: 'CRITICAL',
                alert_type: 'TOKEN_GEN_FAILED',
                message: `Fallo RPC en aprobación automática: ${rpcErr.message}`,
                payload: { error: rpcErr, payload }
              }
            ]);
          } else if (approvalResult && approvalResult.success) {
            // Actualizar wompi_transaction_id
            await supabase
              .from('orders')
              .update({ wompi_transaction_id: transactionId, metodo_pago: 'wompi' })
              .eq('id', orderData.id);

            // Disparar envío de correo si tenemos un token generado
            if (approvalResult.token) {
              const productTitle = orderData.products?.titulo || 'Producto Digital';
              try {
                await fetch(`${supabaseUrl}/functions/v1/send-download-link`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseServiceKey}`
                  },
                  body: JSON.stringify({
                    email: orderData.email_comprador,
                    token: approvalResult.token,
                    titulo_producto: productTitle,
                    referencia: ref
                  })
                });
              } catch (emailErr) {
                console.error('Fallo enviando correo de descarga:', emailErr);
                await supabase.from('payment_alerts').insert([
                  {
                    order_id: orderData.id,
                    severity: 'WARNING',
                    alert_type: 'EMAIL_SEND_FAILED',
                    message: `Orden aprobada pero falló el envío de correo: ${emailErr.message}`,
                    payload: { email: orderData.email_comprador, token: approvalResult.token }
                  }
                ]);
              }
            }

            console.log(`Orden ${orderData.id} conciliada y aprobada exitosamente vía Webhook Wompi.`);
          }
        } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
          await supabase
            .from('orders')
            .update({ estado: 'rechazado', wompi_transaction_id: transactionId })
            .eq('id', orderData.id);

          await supabase.from('payment_audit_logs').insert([
            {
              order_id: orderData.id,
              event_type: `wompi.${status.toLowerCase()}`,
              provider: 'wompi',
              raw_payload: payload,
              signature_valid: isSignatureValid,
              monto_recibido: amountCop,
              estado_previo: orderData.estado,
              estado_nuevo: 'rechazado'
            }
          ]);
        }
      } else {
        console.warn(`No se encontró orden registrada para la referencia Wompi ${ref}`);
      }
    }

    return new Response(JSON.stringify({ received: true, status: 'processed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error procesando Webhook de Wompi:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
