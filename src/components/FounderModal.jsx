import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitFounderApplication } from "../lib/airtable";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb7CBimCHDyd70yCgC12";

const MONTOS = [
  { value: "$500k - $2M", label: "$500.000 – $2.000.000" },
  { value: "$2M - $5M", label: "$2.000.000 – $5.000.000" },
  { value: "+$5M", label: "Más de $5.000.000" },
];

export default function FounderModal({ isOpen, onClose, initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ nombre: "", whatsapp: "", monto: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset when opening
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ nombre: "", whatsapp: "", monto: "" });
      setMode(initialMode);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitFounderApplication({
      ...form,
      fuente: mode === "register" ? "Modal Registro" : "Modal Login → Registro",
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    }
  };

  const isFormValid = form.nombre.trim() && form.whatsapp.trim() && form.monto;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="founder-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <motion.div
            className="founder-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="founder-close" onClick={handleClose} aria-label="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Decorative glow */}
            <div className="founder-glow" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessView key="success" onClose={handleClose} />
              ) : mode === "login" ? (
                <LoginView key="login" onSwitchToRegister={() => setMode("register")} onClose={handleClose} />
              ) : (
                <RegisterView
                  key="register"
                  form={form}
                  setForm={setForm}
                  loading={loading}
                  isFormValid={isFormValid}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   REGISTER VIEW
═══════════════════════════════════════════ */
function RegisterView({ form, setForm, loading, isFormValid, onSubmit }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Badge */}
      <div className="founder-badge-container">
        <div className="founder-badge">
          <span className="founder-badge-dot" />
          Acceso Privado
        </div>
      </div>

      {/* Title */}
      <h2 className="founder-title">
        Acceso Fundador<span className="founder-title-accent">:</span>
        <br />Cohorte Privada 2026
      </h2>

      {/* Description */}
      <p className="founder-description">
        Veltron Capital está habilitando su infraestructura de liquidez de forma escalonada
        para garantizar desembolsos en menos de 15 minutos. Actualmente, el registro está abierto
        únicamente para <strong>Usuarios Fundadores</strong> mediante solicitud previa.
      </p>

      {/* Benefits */}
      <div className="founder-benefits">
        {[
          { label: "Tarifa Preferencial", desc: "10% de gestión (en lugar del 12% público) de por vida" },
          { label: "Prioridad de Dispersión", desc: "Tus retiros siempre van primero en la fila" },
          { label: "Soporte VIP", desc: "Canal directo con el equipo de auditoría" },
        ].map(({ label, desc }) => (
          <div key={label} className="founder-benefit-row">
            <div className="founder-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <span className="founder-benefit-label">{label}</span>
              <span className="founder-benefit-desc">{desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="founder-form">
        {/* Nombre */}
        <div className="founder-field">
          <label className="founder-label">Nombre completo</label>
          <input
            type="text"
            className="founder-input"
            placeholder="Tu nombre y apellido"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
        </div>

        {/* WhatsApp */}
        <div className="founder-field">
          <label className="founder-label">WhatsApp</label>
          <div className="founder-input-wrapper">
            <span className="founder-input-prefix">+57</span>
            <input
              type="tel"
              className="founder-input founder-input-with-prefix"
              placeholder="310 000 0000"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Monto */}
        <div className="founder-field">
          <label className="founder-label">¿Qué monto promedio necesitas liberar mensualmente?</label>
          <select
            className="founder-select"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            required
          >
            <option value="" disabled>Seleccionar rango</option>
            {MONTOS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="founder-submit"
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <span className="founder-loading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Procesando solicitud…
            </span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Solicitar mi Acceso Fundador
            </>
          )}
        </button>

        <p className="founder-micro-copy">
          Al unirte como fundador, aseguras una <strong>tarifa preferencial de lanzamiento</strong> de por vida.
        </p>
      </form>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   LOGIN VIEW (Simplificado — sin código)
═══════════════════════════════════════════ */
function LoginView({ onSwitchToRegister }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Badge */}
      <div className="founder-badge-container">
        <div className="founder-badge founder-badge-amber">
          <span className="founder-badge-dot founder-badge-dot-amber" />
          Estado del Sistema
        </div>
      </div>

      {/* Icon */}
      <div className="founder-login-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="founder-title" style={{ fontSize: "1.5rem" }}>
        Validación de Identidad<br />en Curso
      </h2>

      {/* Description */}
      <p className="founder-description" style={{ marginBottom: "1.5rem" }}>
        El inicio de sesión está habilitado temporalmente solo para el <strong>equipo de Auditoría
          y Fase Alpha</strong>. Si eres un nuevo usuario, por favor solicita tu ingreso a la
        Cohorte Fundadora para ser notificado apenas tu perfil sea activado.
      </p>

      {/* Status bar */}
      <div className="founder-status-bar">
        <div className="founder-status-row">
          <span className="founder-status-label">Infraestructura de liquidez</span>
          <span className="founder-status-value founder-status-done">Validada ✓</span>
        </div>
        <div className="founder-status-row">
          <span className="founder-status-label">Módulo de dispersión</span>
          <span className="founder-status-value founder-status-done">Activo ✓</span>
        </div>
        <div className="founder-status-row">
          <span className="founder-status-label">Apertura de cuentas</span>
          <span className="founder-status-value founder-status-progress">En curso…</span>
        </div>
      </div>

      {/* Divider */}
      <div className="founder-divider-text">
        <span>Solicita tu acceso</span>
      </div>

      {/* CTA */}
      <button className="founder-submit" onClick={onSwitchToRegister}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        Solicitar Acceso Fundador
      </button>

      <p className="founder-micro-copy">
        Serás notificado por WhatsApp apenas tu perfil sea activado.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS VIEW
═══════════════════════════════════════════ */
function SuccessView({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      style={{ textAlign: "center" }}
    >
      {/* Animated check */}
      <motion.div
        className="founder-success-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </motion.div>

      <h2 className="founder-title" style={{ fontSize: "1.5rem", marginTop: "1.25rem" }}>
        ¡Solicitud Recibida!
      </h2>

      <p className="founder-description" style={{ marginBottom: "1.5rem" }}>
        Tu solicitud ha sido registrada exitosamente. Te notificaremos por
        <strong> WhatsApp</strong> apenas tu perfil sea activado en la plataforma.
      </p>

      {/* Status */}
      <div className="founder-success-status">
        <div className="founder-success-status-icon" />
        <span>Posición en la lista de espera asegurada</span>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="founder-whatsapp-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Únete al Canal de Anuncios
      </a>

      <p className="founder-micro-copy" style={{ marginTop: "1rem" }}>
        Para acelerar tu proceso de validación, únete a nuestro canal de anuncios en WhatsApp.
      </p>

      <button
        className="founder-close-text"
        onClick={onClose}
      >
        Cerrar ventana
      </button>
    </motion.div>
  );
}
