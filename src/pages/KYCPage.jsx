import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const STEPS_KYC = [
  { id: "personal", label: "Datos Personales", icon: "👤", done: true },
  { id: "document", label: "Documento", icon: "🪪", done: true },
  { id: "selfie", label: "Selfie", icon: "📸", done: false, active: true },
  { id: "bank", label: "Cuenta Bancaria", icon: "🏦", done: false },
  { id: "review", label: "Revisión", icon: "✅", done: false },
];

function UploadZone({ label, sublabel, icon, uploaded, onUpload }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`upload-zone ${dragging ? "dragging" : ""} ${uploaded ? "uploaded" : ""}`}
      style={{
        background: uploaded ? "rgba(0,108,73,0.04)" : undefined,
        borderColor: uploaded ? "rgba(0,108,73,0.4)" : undefined,
      }}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onUpload();
      }}
      onClick={onUpload}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: uploaded ? "rgba(0,108,73,0.1)" : "var(--surface-container)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
        transition: "all 0.3s",
      }}>
        {uploaded ? "✅" : icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)", marginBottom: "0.25rem" }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>{uploaded ? "Archivo cargado correctamente" : sublabel}</div>
      </div>
      {!uploaded && (
        <div style={{
          padding: "0.5rem 1.25rem",
          borderRadius: 999,
          background: "rgba(14,165,233,0.1)",
          color: "var(--primary)",
          fontSize: "0.8rem", fontWeight: 600,
        }}>
          {dragging ? "Suelta aquí" : "Seleccionar archivo"}
        </div>
      )}
    </div>
  );
}

export default function KYCPage() {
  const [uploads, setUploads] = useState({ front: false, back: false, selfie: false });
  const [activeSection, setActiveSection] = useState("selfie");
  const progress = Object.values(uploads).filter(Boolean).length;

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">
        {/* KYC Progress */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div className="card">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--on-surface)" }}>Estado de Verificación</div>
                <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Completa todos los pasos para acceso completo</div>
              </div>
              <div style={{
                background: "rgba(146,64,14,0.08)",
                color: "#92400e",
                padding: "4px 14px", borderRadius: 999,
                fontSize: "0.75rem", fontWeight: 700,
              }}>
                En Verificación
              </div>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>Progreso general</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)" }}>60% completado</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Steps timeline */}
            <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {STEPS_KYC.map((s) => (
                <div key={s.id} style={{
                  flexShrink: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.25rem",
                  borderRadius: 14,
                  background: s.active ? "rgba(14,165,233,0.08)" : s.done ? "rgba(0,108,73,0.06)" : "var(--surface-container-low)",
                  border: s.active ? "1.5px solid rgba(14,165,233,0.25)" : "1.5px solid transparent",
                  minWidth: 100, cursor: "pointer",
                  transition: "all 0.2s",
                }} onClick={() => setActiveSection(s.id)}>
                  <div style={{ fontSize: "1.3rem" }}>{s.done ? "✅" : s.icon}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 600, color: s.active ? "var(--primary)" : s.done ? "#006C49" : "var(--on-surface-variant)", textAlign: "center" }}>
                    {s.label}
                  </div>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: s.done ? "#006C49" : s.active ? "var(--primary-container)" : "var(--outline-variant)",
                  }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid-1-2">
          {/* Left - Instructions */}
          <motion.div variants={fadeUp}>
            <div className="card" style={{ marginBottom: "var(--spacing-4)" }}>
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)" }}>📋 Instrucciones</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {[
                  { icon: "💡", text: "Asegúrate de que el documento esté bien iluminado y sin reflejos" },
                  { icon: "📐", text: "El documento debe ocupar al menos el 80% del encuadre" },
                  { icon: "🔍", text: "Verifica que el texto sea legible y que no esté cortado" },
                  { icon: "🚫", text: "No se aceptan fotocopias ni documentos expirados" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)" }}>🔐 Privacidad</div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
                Tu información es procesada con cifrado AES-256. Nunca compartimos tus datos con terceros sin tu consentimiento expreso.
              </p>
            </div>
          </motion.div>

          {/* Right - Upload Areas */}
          <motion.div variants={fadeUp}>
            <div className="card">
              <div className="card-header">
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--on-surface)" }}>📸 Validación de Identidad</div>
                <p style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>
                  Sube una foto clara de tu documento de identidad en ambas caras más una selfie sosteniendo el documento.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <UploadZone
                  label="Cédula — Cara frontal"
                  sublabel="JPG, PNG o PDF - Máx. 10MB"
                  icon="🪪"
                  uploaded={uploads.front}
                  onUpload={() => setUploads({ ...uploads, front: true })}
                />
                <UploadZone
                  label="Cédula — Cara trasera"
                  sublabel="JPG, PNG o PDF - Máx. 10MB"
                  icon="📄"
                  uploaded={uploads.back}
                  onUpload={() => setUploads({ ...uploads, back: true })}
                />
                <UploadZone
                  label="Selfie con documento"
                  sublabel="Sostén tu cédula cerca del rostro"
                  icon="🤳"
                  uploaded={uploads.selfie}
                  onUpload={() => setUploads({ ...uploads, selfie: true })}
                />
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(progress / 3) * 100}%` }} />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)", marginTop: "0.375rem" }}>
                    {progress}/3 documentos cargados
                  </div>
                </div>
                <button
                  className={`btn-primary btn-sm ${progress < 3 ? "" : ""}`}
                  disabled={progress < 3}
                  style={{ opacity: progress < 3 ? 0.5 : 1 }}
                >
                  {progress < 3 ? `Faltan ${3 - progress}` : "✓ Enviar"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
