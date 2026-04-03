import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: checked ? "linear-gradient(135deg, #006591, #0EA5E9)" : "var(--surface-container-high)",
        border: "none", cursor: "pointer", position: "relative", transition: "all 0.3s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3, transition: "left 0.3s",
        left: checked ? 23 : 3,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const [form, setForm] = useState({ nombre: "Andrés", apellido: "Castillo", email: "andres@email.com", telefono: "+57 310 000 0000", ciudad: "Bogotá" });
  const [notifs, setNotifs] = useState({ retiros: true, seguridad: true, novedades: false, marketing: false });
  const [twoFA, setTwoFA] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">

        {/* Profile Hero */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,101,145,0.06), rgba(14,165,233,0.04))",
            borderRadius: 20, padding: "2rem",
            display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #006591, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.75rem",
              boxShadow: "0 8px 24px rgba(0,101,145,0.25)",
              flexShrink: 0,
            }}>
              AC
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.5px" }}>
                Andrés Castillo
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", marginTop: 2 }}>andres@email.com · +57 310 000 0000</div>
              <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                <span className="chip chip-primary">Usuario Premium</span>
                <span className="chip chip-tertiary">✓ KYC Verificado</span>
                <span className="chip chip-neutral">Desde Oct 2024</span>
              </div>
            </div>
            <button className="btn-outline btn-sm">Cambiar foto</button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} style={{ marginBottom: "1.5rem" }}>
          <div className="tabs">
            {[["personal", "👤 Perfil"], ["seguridad", "🔐 Seguridad"], ["notificaciones", "🔔 Notificaciones"], ["cuentas", "🏦 Cuentas Destino"]].map(([key, lbl]) => (
              <button key={key} className={`tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>{lbl}</button>
            ))}
          </div>
        </motion.div>

        {/* ── TAB: Perfil ── */}
        {activeTab === "personal" && (
          <motion.div key="personal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="card-header">
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Información Personal</div>
              <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Esta información se usa para verificar tu identidad en cada retiro</div>
            </div>
            <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
              {[["Nombre", "nombre", "Andrés", "text"], ["Apellido", "apellido", "Castillo", "text"], ["Correo electrónico", "email", "andres@email.com", "email"], ["Teléfono", "telefono", "+57 310 000 0000", "tel"], ["Ciudad", "ciudad", "Bogotá", "text"]].map(([label, key, placeholder, type]) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <input type={type} className="input-field" value={form[key] || ""} placeholder={placeholder} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button className="btn-primary" onClick={handleSave}>Guardar cambios</button>
              {savedMsg && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "0.8rem", color: "#006C49", fontWeight: 600 }}>✓ Guardado correctamente</motion.span>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TAB: Seguridad ── */}
        {activeTab === "seguridad" && (
          <motion.div key="seg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            <div className="card">
              <div className="card-header">
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Cambiar Contraseña</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 440 }}>
                {["Contraseña actual", "Nueva contraseña", "Confirmar nueva contraseña"].map(lbl => (
                  <div key={lbl}>
                    <label className="input-label">{lbl}</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                ))}
                <button className="btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>Actualizar contraseña</button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Autenticación en Dos Pasos</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--on-surface)" }}>
                    2FA vía SMS {twoFA ? <span className="chip chip-tertiary">Activo</span> : <span className="chip chip-neutral">Desactivado</span>}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Agrega una capa extra de seguridad a tu cuenta</div>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>
            </div>

            <div className="card" style={{ borderTop: "2px solid rgba(186,26,26,0.15)" }}>
              <div className="card-header">
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--error)" }}>Zona de Peligro</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--on-surface)" }}>Eliminar cuenta</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>Esta acción es permanente e irreversible</div>
                </div>
                <button style={{ padding: "0.5rem 1.25rem", borderRadius: 999, background: "rgba(186,26,26,0.08)", color: "var(--error)", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: Notificaciones ── */}
        {activeTab === "notificaciones" && (
          <motion.div key="notif" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="card-header">
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Preferencias de Notificación</div>
              <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Controla qué información recibes y por qué canal</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { key: "retiros", label: "Retiros completados", desc: "Notificación cuando tu efectivo es enviado exitosamente" },
                { key: "seguridad", label: "Alertas de seguridad", desc: "Accesos inusuales, cambios de contraseña, 2FA" },
                { key: "novedades", label: "Novedades del producto", desc: "Nuevas funcionalidades y mejoras de la plataforma" },
                { key: "marketing", label: "Comunicaciones comerciales", desc: "Promociones, descuentos y campañas de Veltron" },
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid rgba(190,200,210,0.15)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--on-surface)" }}>{label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: 2 }}>{desc}</div>
                  </div>
                  <Toggle checked={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
                </div>
              ))}
            </div>
            <button className="btn-primary btn-sm" style={{ marginTop: "1.5rem", alignSelf: "flex-start" }}>Guardar preferencias</button>
          </motion.div>
        )}

        {/* ── TAB: Cuentas de Destino ── */}
        {activeTab === "cuentas" && (
          <motion.div key="cuentas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            <div className="card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Cuentas de Destino</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Cuentas verificadas donde recibes tus desembolsos</div>
                </div>
                <button className="btn-primary btn-sm">+ Agregar Cuenta</button>
              </div>

              {/* Nequi account */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(107,33,168,0.06), rgba(107,33,168,0.03))",
                borderRadius: 16,
                marginBottom: "1rem",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(107,33,168,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>💜</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)" }}>Nequi · 316 XXX X890</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>Andrés Castillo · Verificada</div>
                </div>
                <span className="chip chip-tertiary" style={{ display: "flex", alignItems: "center", gap: 4 }}>✓ Principal</span>
                <button style={{ padding: "0.375rem 0.875rem", borderRadius: 999, background: "rgba(186,26,26,0.08)", color: "var(--error)", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Eliminar</button>
              </div>

              {/* Daviplata account */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.25rem",
                background: "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(239,68,68,0.02))",
                borderRadius: 16,
                marginBottom: "1rem",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(239,68,68,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>🟡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)" }}>Daviplata · 310 XXX X214</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>Andrés Castillo · Verificada</div>
                </div>
                <span className="chip chip-neutral">Secundaria</span>
                <button style={{ padding: "0.375rem 0.875rem", borderRadius: 999, background: "rgba(186,26,26,0.08)", color: "var(--error)", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Eliminar</button>
              </div>

              {/* Add account placeholder */}
              <div style={{
                border: "2px dashed var(--outline-variant)", borderRadius: 16,
                padding: "1.5rem", textAlign: "center", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary-container)"; e.currentTarget.style.background = "rgba(14,165,233,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--outline-variant)"; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🏦</div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>Agregar nueva cuenta de destino</div>
                <div style={{ fontSize: "0.75rem", color: "var(--outline)", marginTop: "0.25rem" }}>Nequi, Daviplata o cuenta bancaria</div>
              </div>
            </div>

            <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.2rem" }}>🔒</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--on-surface)", marginBottom: "0.375rem" }}>Pago seguro sin almacenar tarjetas</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
                    Cada pago se procesa como servicio único a través del checkout seguro de Wompi. Nunca almacenamos datos de tarjetas de crédito. Solo guardamos tus cuentas de destino verificadas para recibir desembolsos.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
