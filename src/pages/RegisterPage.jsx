import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/kyc"); }, 1400);
  };

  const passwordOk = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[!@#$%^&*]/.test(form.password);

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      {/* Left - Form */}
      <div style={{
        background: "var(--surface-container-low)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem",
      }}>
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 460 }}>
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "2rem" }}>
              <div style={{
                width: 32, height: 32, background: "linear-gradient(135deg, #006591, #0EA5E9)",
                borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 13,
              }}>V</div>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--on-surface)" }}>VELTRON<span style={{ color: "#0EA5E9" }}>.</span></span>
            </Link>
            <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px", marginBottom: "0.5rem" }}>
              Crear Cuenta
            </h1>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
              Obtén efectivo de tu tarjeta de crédito de forma fácil, rápida y segura.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label className="input-label">Nombre</label>
                <input className="input-field" placeholder="Andrés" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Apellido</label>
                <input className="input-field" placeholder="Castillo" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} required />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ marginBottom: "1.25rem" }}>
              <label className="input-label">Correo Electrónico</label>
              <div className="input-wrapper">
                <div className="input-icon-left" style={{ top: "50%", transform: "translateY(-50%)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" className="input-field has-icon-left" placeholder="tu@correo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ marginBottom: "0.5rem" }}>
              <label className="input-label">Contraseña</label>
              <div className="input-wrapper">
                <div className="input-icon-left" style={{ top: "50%", transform: "translateY(-50%)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input type="password" className="input-field has-icon-left" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </motion.div>

            {form.password.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "1.25rem" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 8,
                }}>
                  {[
                    form.password.length >= 8,
                    /[A-Z]/.test(form.password),
                    /[!@#$%^&*]/.test(form.password),
                  ].map((ok, i) => (
                    <div key={i} style={{
                      height: 4, borderRadius: 99,
                      background: ok
                        ? (passwordOk ? "#006C49" : "#0EA5E9")
                        : "var(--surface-container-high)",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                  Debe contener al menos 8 caracteres, una mayúscula y un carácter especial.
                </p>
              </motion.div>
            )}

            <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "2rem" }}>
              <input type="checkbox" id="terms" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 3, cursor: "pointer", accentColor: "var(--primary)" }} />
              <label htmlFor="terms" style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", cursor: "pointer" }}>
                Acepto los{" "}
                <a href="#" style={{ color: "var(--primary)", fontWeight: 600 }}>Términos de Servicio</a>
                {" "}y la{" "}
                <a href="#" style={{ color: "var(--primary)", fontWeight: 600 }}>Política de Privacidad</a>
              </label>
            </motion.div>

            <motion.button variants={fadeUp} type="submit" className="btn-primary btn-full" disabled={loading || !accepted} style={{ marginBottom: "1rem", fontSize: "1rem", opacity: (!accepted || loading) ? 0.7 : 1 }}>
              {loading ? "Creando tu cuenta…" : "Crear Cuenta Gratis"}
            </motion.button>

            <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Iniciar sesión</Link>
            </motion.p>
          </form>
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
          <h2 style={{
            fontFamily: "Manrope, sans-serif", fontSize: "2rem", fontWeight: 800,
            color: "white", letterSpacing: "-1px", marginBottom: "2rem",
          }}>
            Únete a miles de usuarios que ya confían en Veltron Capital.
          </h2>

          {[
            { icon: "🔒", text: "Datos 100% encriptados con AES-256" },
            { icon: "⚡", text: "Retiros procesados en menos de 5 minutos" },
            { icon: "🏅", text: "Certificación PCI DSS internacional" },
            { icon: "🌐", text: "Disponible las 24 horas, los 7 días" },
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
    </div>
  );
}
