import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showRecovery, setShowRecovery] = useState(false);

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
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
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
          </Link>
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
            {[["10%", "Fundador"], ["< 5 min", "Envío"], ["24/7", "Soporte"], ["100%", "Seguro"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{val}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", zIndex: 1 }}>
          © 2026 Veltron Capital. Tu cupo, tu efectivo.
        </p>
      </div>

      {/* Right Panel - Login Form with Alpha Banner */}
      <div style={{
        background: "var(--surface-container-low)",
        display: "flex",
        flexDirection: "column",
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
          {/* ═══ ALPHA BANNER ═══ */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.875rem",
              padding: "1rem 1.25rem",
              background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 16,
              marginBottom: "2rem",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
              border: "1px solid rgba(245,158,11,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#92400e",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "0.3rem",
              }}>
                <span style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  color: "#92400e",
                  letterSpacing: "-0.3px",
                }}>
                  Modo Alpha Activo
                </span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  background: "rgba(245,158,11,0.12)",
                  borderRadius: 999,
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#b45309",
                }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    boxShadow: "0 0 8px rgba(245,158,11,0.6)",
                    animation: "pulse-glow-amber 2s infinite",
                  }} />
                  ACTIVO
                </span>
              </div>
              <p style={{
                fontSize: "0.78rem",
                color: "#78716c",
                lineHeight: 1.45,
                margin: 0,
              }}>
                Solo usuarios con activación prioritaria pueden iniciar sesión en este momento.
              </p>
            </div>
          </motion.div>

          {/* ═══ HEADING ═══ */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2rem" }}>
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

          {/* ═══ LOGIN FORM ═══ */}
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

            <motion.div variants={fadeUp} style={{ marginBottom: "1.5rem", position: "relative" }}>
              <div style={{ textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowRecovery(r => !r)}
                  style={{
                    fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Recovery Panel */}
              <AnimatePresence>
                {showRecovery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "1rem 1.125rem",
                      background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(14,165,233,0.02))",
                      border: "1px solid rgba(14,165,233,0.15)",
                      borderRadius: 14,
                    }}>
                      {/* Icon */}
                      <div style={{
                        width: 34, height: 34, flexShrink: 0,
                        borderRadius: 9,
                        background: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(14,165,233,0.06))",
                        border: "1px solid rgba(14,165,233,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--primary)",
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>

                      <div>
                        <div style={{
                          fontFamily: "Manrope, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "var(--on-surface)",
                          letterSpacing: "-0.2px",
                          marginBottom: "0.3rem",
                        }}>
                          Recuperación de Acceso Alpha
                        </div>
                        <p style={{
                          fontSize: "0.78rem",
                          color: "var(--on-surface-variant)",
                          lineHeight: 1.5,
                          margin: 0,
                          marginBottom: "0.625rem",
                        }}>
                          Debido a que nos encontramos en la <strong style={{ color: "var(--on-surface)" }}>Fase de Cohorte Fundadora</strong>, todas las activaciones y credenciales se gestionan de forma personalizada vía Correo.
                        </p>
                        <a
                          href="mailto:soporte@veltroncapital.com?subject=Recuperación%20de%20Acceso%20Alpha"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "var(--primary)",
                            textDecoration: "none",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          soporte@veltroncapital.com
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              ¿No tienes acceso aún?{" "}
              <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                Solicitar Acceso Fundador
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-glow-amber {
          0%, 100% { box-shadow: 0 0 4px rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 12px rgba(245,158,11,0.6); }
        }
      `}</style>
    </div>
  );
}
