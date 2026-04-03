import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1.1fr",
    }}>
      {/* Left Panel - Branding */}
      <div style={{
        background: "linear-gradient(160deg, #131b2e 0%, #006591 60%, #0EA5E9 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 1 }}>
          <div style={{
            width: 40, height: 40,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 16,
          }}>V</div>
          <div>
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1rem", color: "white", letterSpacing: "-0.5px" }}>VELTRON</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>CAPITAL</div>
          </div>
        </div>

        {/* Center content */}
        <div style={{ zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            padding: "0.5rem 1rem", borderRadius: 999,
            fontSize: "0.7rem", fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.5px",
            marginBottom: "1.5rem",
          }}>
            Liquidez en un clic
          </div>
          <h2 style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "2.5rem", fontWeight: 800,
            color: "white", letterSpacing: "-1.5px",
            lineHeight: 1.1, marginBottom: "1.25rem",
          }}>
            Tu cupo, liberado.<br />Tu efectivo, al instante.
          </h2>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
            {[["12%", "Comisión"], ["< 5 min", "Envío"], ["24/7", "Soporte"], ["100%", "Seguro"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{val}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", zIndex: 1 }}>
          © 2024 Veltron Capital. Tu cupo, tu efectivo.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        background: "var(--surface-container-low)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
      }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ width: "100%", maxWidth: 420 }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem" }}>
            <h1 style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "1.75rem", fontWeight: 800,
              color: "var(--on-surface)", letterSpacing: "-1px",
              marginBottom: "0.5rem",
            }}>
              Bienvenido de nuevo
            </h1>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
              Dinero disponible de tu tarjeta, directo a tu cuenta bancaria.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div variants={fadeUp} style={{ marginBottom: "1.25rem" }}>
              <label className="input-label">Correo Electrónico</label>
              <div className="input-wrapper">
                <div className="input-icon-left" style={{ top: "50%", transform: "translateY(-50%)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="input-field has-icon-left"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ marginBottom: "0.75rem" }}>
              <label className="input-label">Contraseña</label>
              <div className="input-wrapper" style={{ position: "relative" }}>
                <div className="input-icon-left" style={{ top: "50%", transform: "translateY(-50%)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field has-icon-left"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: "3rem" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--outline)", padding: 4,
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ textAlign: "right", marginBottom: "2rem" }}>
              <a href="#" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
              style={{ marginBottom: "1rem", fontSize: "1rem", opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Iniciando sesión…
                </span>
              ) : "Iniciar Sesión"}
            </motion.button>

            <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
              ¿No tienes una cuenta?{" "}
              <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                Obtén efectivo ya
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
