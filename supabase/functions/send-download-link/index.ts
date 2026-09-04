import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://biblioteca-digital.vercel.app";

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
          message: "Modo prueba: correo simulado",
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
        from: "Biblioteca Digital <descargas@resend.dev>",
        to: [email],
        subject: `¡Tu producto digital está listo! — ${titulo_producto || "Biblioteca Digital"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0d9488;">¡Pago Confirmado! 🎉</h2>
            <p>Hemos verificado con éxito tu pago para la orden con referencia <strong>${referencia}</strong>.</p>
            <p>Ya puedes descargar tu archivo digital: <strong>${titulo_producto}</strong>.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${downloadUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Descargar Archivo Ahora
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">* Este enlace vence en 48 horas y puede usarse para la descarga.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 11px; color: #999; text-align: center;">Biblioteca Digital — Paga $1.000. Descarga en minutos.</p>
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
