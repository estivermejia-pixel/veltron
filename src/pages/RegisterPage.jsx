import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { submitFounderApplication } from "../lib/airtable";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb7CBimCHDyd70yCgC12";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const MONTOS = [
  { value: "$500k - $2M", label: "$500.000 – $2.000.000" },
  { value: "$2M - $5M", label: "$2.000.000 – $5.000.000" },
  { value: "+$5M", label: "Más de $5.000.000" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: "", whatsapp: "", monto: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFormValid = form.nombre.trim() && form.whatsapp.trim() && form.monto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitFounderApplication({
      ...form,
      fuente: "Página Registro",
    });
    setLoading(false);
    if (result.success) setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      {/* Left - Founder Application Form */}
      <div style={{
        background: "var(--surface-container-low)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem",
      }}>
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 480 }}>

          {submitted ? (
            /* ═══ SUCCESS STATE ═══ */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
                className="founder-success-icon"
                style={{ margin: "0 auto 1.5rem" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </motion.div>

              <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px", marginBottom: "0.75rem" }}>
                ¡Solicitud Recibida!
              </h1>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Tu solicitud ha sido registrada exitosamente. Te notificaremos por <strong>WhatsApp</strong> apenas tu perfil sea activado.
              </p>

              <div className="founder-success-status" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
                <div className="founder-success-status-icon" />
                <span>Posición en la lista de espera asegurada</span>
              </div>

              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="founder-whatsapp-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Únete al Canal de Anuncios
              </a>

              <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                Para acelerar tu proceso de validación, únete a nuestro canal de anuncios en WhatsApp.
              </p>

              <Link to="/" style={{ display: "block", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600 }}>
                ← Volver al inicio
              </Link>
            </motion.div>
          ) : (
            /* ═══ APPLICATION FORM ═══ */
            <>
              <motion.div variants={fadeUp} style={{ marginBottom: "2rem" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "2rem" }}>
                  <div style={{
                    width: 32, height: 32, background: "linear-gradient(135deg, #006591, #0EA5E9)",
                    borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 13,
                  }}>V</div>
                  <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--on-surface)" }}>VELTRON<span style={{ color: "#0EA5E9" }}>.</span></span>
                </Link>

                <div className="founder-badge" style={{ marginBottom: "1.25rem" }}>
                  <span className="founder-badge-dot" />
                  Acceso Privado
                </div>

                <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px", marginBottom: "0.5rem" }}>
                  Acceso Fundador<span style={{ color: "#0EA5E9" }}>:</span><br />
                  Cohorte Privada 2026
                </h1>
                <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  Veltron Capital está habilitando su infraestructura de liquidez de forma escalonada para garantizar desembolsos en menos de 15 minutos. Actualmente, el registro está abierto únicamente para <strong style={{ color: "var(--on-surface)" }}>Usuarios Fundadores</strong> mediante solicitud previa.
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeUp} className="founder-benefits" style={{ marginBottom: "1.5rem" }}>
                {[
                  { label: "Tarifa Preferencial", desc: "10% de gestión (en lugar del 12% público) de por vida" },
                  { label: "Prioridad de Dispersión", desc: "Tus retiros siempre van primero en la fila" },
                  { label: "Soporte VIP", desc: "Canal directo con el equipo de auditoría" },
                ].map(({ label, desc }) => (
                  <div key={label} className="founder-benefit-row">
                    <div className="founder-check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div>
                      <span className="founder-benefit-label">{label}</span>
                      <span className="founder-benefit-desc">{desc}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="founder-form">
                <motion.div variants={fadeUp} className="founder-field">
                  <label className="founder-label">Nombre completo</label>
                  <input type="text" className="founder-input" placeholder="Tu nombre y apellido" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                </motion.div>

                <motion.div variants={fadeUp} className="founder-field">
                  <label className="founder-label">WhatsApp</label>
                  <div className="founder-input-wrapper">
                    <span className="founder-input-prefix">+57</span>
                    <input type="tel" className="founder-input founder-input-with-prefix" placeholder="310 000 0000" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} required />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="founder-field">
                  <label className="founder-label">¿Qué monto promedio necesitas liberar mensualmente?</label>
                  <select className="founder-select" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} required>
                    <option value="" disabled>Seleccionar rango</option>
                    {MONTOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </motion.div>

                <motion.button variants={fadeUp} type="submit" className="founder-submit" disabled={!isFormValid || loading}>
                  {loading ? (
                    <span className="founder-loading">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      Procesando solicitud…
                    </span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      Solicitar mi Acceso Fundador
                    </>
                  )}
                </motion.button>

                <motion.p variants={fadeUp} className="founder-micro-copy">
                  Al unirte como fundador, aseguras una <strong>tarifa preferencial de lanzamiento</strong> de por vida.
                </motion.p>
              </form>

              <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--on-surface-variant)", marginTop: "1.5rem" }}>
                ¿Ya solicitaste tu acceso?{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Ver estado</Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right - Branding */}
      <div style={{
        background: "linear-gradient(160deg, #131b2e 0%, #006591 60%, #0EA5E9 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "3rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, left: -100,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{ zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,177,123,0.15)",
            border: "1px solid rgba(0,177,123,0.25)",
            padding: "0.5rem 1rem", borderRadius: 999,
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
            color: "#00B17B",
            marginBottom: "1.5rem",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Beneficios Exclusivos
          </div>

          <h2 style={{
            fontFamily: "Manrope, sans-serif", fontSize: "2rem", fontWeight: 800,
            color: "white", letterSpacing: "-1px", marginBottom: "2rem",
            lineHeight: 1.15,
          }}>
            Únete a la Cohorte Fundadora y asegura tu ventaja de por vida.
          </h2>

          {[
            { icon: "🔒", text: "Datos 100% encriptados con AES-256" },
            { icon: "⚡", text: "Retiros procesados en menos de 5 minutos" },
            { icon: "💰", text: "Tarifa preferencial del 10% de por vida" },
            { icon: "🥇", text: "Prioridad #1 en la fila de dispersión" },
            { icon: "🎯", text: "Soporte VIP con canal directo de auditoría" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: "1rem",
              marginBottom: "1rem",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "0.875rem 1.25rem",
            }}>
              <span style={{ fontSize: "1.2rem" }}>{icon}</span>
              <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
