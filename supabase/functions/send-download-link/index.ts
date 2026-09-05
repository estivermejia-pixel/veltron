import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://veltroncapital.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { email, token, titulo_producto, referencia } = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Email y token son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const downloadUrl = `${SITE_URL}/descarga/${token}`;

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY no configurada. URL de descarga:", downloadUrl);
      return new Response(
        JSON.stringify({
          message: "Modo demostración: enlace generado exitosamente",
          downloadUrl,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Veltron Capital <descargas@veltroncapital.com>",
        to: [email],
        subject: `¡Tu producto digital está listo! — ${titulo_producto || "Veltron Capital"}`,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0284c7; margin: 0; font-size: 24px;">Veltron Capital</h2>
              <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Confirmación de Pedido y Enlace de Descarga</p>
            </div>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">¡Pago Verificado con Éxito! 🎉</h3>
              <p style="color: #15803d; margin: 0; font-size: 14px;">Hemos confirmado tu pago para la referencia <strong>${referencia}</strong>.</p>
            </div>

            <p style="color: #374151; font-size: 15px;">Tu archivo digital <strong>${titulo_producto || "Producto Digital"}</strong> ya se encuentra disponible para su descarga inmediata.</p>
            
            <div style="margin: 32px 0; text-align: center;">
              <a href="${downloadUrl}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                Descargar Producto Ahora
              </a>
            </div>

            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 24px;">
              * Este enlace es de un solo uso y vencerá automáticamente en 48 horas por seguridad.
            </p>
            
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
              Veltron Capital — Paga lo que gustes. Descarga en minutos.<br/>
              Si tienes preguntas, contáctanos a soporte@veltroncapital.com
            </p>
          </div>
        `,
      }),
    });

    const data = await resendRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
