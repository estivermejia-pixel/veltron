import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const SECTIONS = [
  {
    title: "1. Introducción",
    content: `Bienvenido a Veltron Capital. Al utilizar nuestra plataforma, aceptas que tus datos personales sean procesados conforme a esta Política de Privacidad. Nos comprometemos a proteger tu información con los más altos estándares de seguridad de la industria financiera.`
  },
  {
    title: "2. Información que Recopilamos",
    content: `Recopilamos la siguiente información para prestarte nuestros servicios:\n\n• Información de identidad: nombre, apellido, número de cédula, fecha de nacimiento.\n• Información de contacto: correo electrónico, número de teléfono.\n• Información financiera: datos de tarjeta de crédito (procesados con cifrado PCI DSS), historial de transacciones.\n• Información biométrica: fotografía de documento y selfie para verificación KYC.\n• Datos de uso: información sobre cómo utilizas nuestra plataforma.`
  },
  {
    title: "3. Cómo Utilizamos tu Información",
    content: `Utilizamos tu información exclusivamente para:\n\n• Verificar tu identidad y prevenir fraudes.\n• Procesar tus solicitudes de retiro de efectivo.\n• Cumplir con obligaciones legales y regulatorias.\n• Mejorar nuestros servicios y experiencia de usuario.\n• Enviarte notificaciones sobre tus transacciones.\n• Brindarte soporte personalizado 24/7.`
  },
  {
    title: "4. Seguridad de los Datos",
    content: `Implementamos medidas de seguridad de grado institucional:\n\n• Cifrado AES-256 para todos los datos en tránsito y en reposo.\n• Certificación PCI DSS para el procesamiento de tarjetas.\n• Biometría activa para validación de identidad en tiempo real.\n• Monitoreo 24/7 con detección automática de anomalías.\n• Servidores en infraestructura segura con acceso restringido.`
  },
  {
    title: "5. Compartición de Datos",
    content: `Nunca vendemos tus datos personales a terceros. Tu información puede ser compartida únicamente en los siguientes casos:\n\n• Con entidades financieras para procesar tus transacciones.\n• Con autoridades regulatorias cuando sea legalmente requerido.\n• Con proveedores de servicios esenciales bajo estrictos acuerdos de confidencialidad.`
  },
  {
    title: "6. Tus Derechos (Ley 1581 de 2012)",
    content: `Como usuario colombiano, tienes derecho a:\n\n• Conocer, actualizar y rectificar tu información personal.\n• Solicitar la eliminación de tus datos cuando corresponda.\n• Ser informado sobre el uso que se da a tus datos.\n• Revocar la autorización de tratamiento de tus datos.\n• Presentar quejas ante la Superintendencia de Industria y Comercio.\n\nPara ejercer estos derechos, contáctanos en: privacidad@veltron.capital`
  },
  {
    title: "7. Cookies y Rastreo",
    content: `Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies analíticas anónimas para mejorar la experiencia. No utilizamos cookies de publicidad de terceros. Puedes desactivar las cookies no esenciales en cualquier momento desde la configuración de tu cuenta.`
  },
  {
    title: "8. Retención de Datos",
    content: `Conservamos tus datos durante el tiempo que seas usuario activo y por el período adicional requerido por la ley. Para datos de transacciones financieras, la retención mínima es de 5 años conforme a la regulación financiera colombiana.`
  },
  {
    title: "9. Cambios a esta Política",
    content: `Podemos actualizar esta política periódicamente. Te notificaremos con al menos 30 días de anticipación sobre cambios materiales. El uso continuado de la plataforma después de la notificación constituye aceptación de los cambios.`
  },
  {
    title: "10. Contacto",
    content: `Para consultas sobre privacidad:\n\nEmail: privacidad@veltron.capital\nDirección: Bogotá, Colombia\nTeléfono: +57 (1) 800-VELTRON\n\nDelegado de Protección de Datos: dpo@veltron.capital`
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        padding: "1.25rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface-container-lowest)",
        borderBottom: "1px solid rgba(190,200,210,0.2)",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(19,27,46,0.04)",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #006591, #0EA5E9)",
            borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 13,
          }}>V</div>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--on-surface)" }}>
            VELTRON<span style={{ color: "#0EA5E9" }}>.</span>
          </span>
        </Link>
        <Link to="/" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>← Volver al inicio</Link>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 2.5rem" }}>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} style={{ marginBottom: "3rem" }}>
            <span className="section-badge" style={{ marginBottom: "1.25rem" }}>Legal</span>
            <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-2px", marginBottom: "1rem" }}>
              Política de Privacidad
            </h1>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>📅 Última actualización: 1 de octubre de 2024</span>
              <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>📋 Versión 2.1</span>
              <span style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>🇨🇴 Ley 1581 de 2012</span>
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem" }}>
            <div style={{
              background: "rgba(14,165,233,0.06)",
              border: "1px solid rgba(14,165,233,0.2)",
              borderRadius: 20, padding: "1.75rem",
            }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>ℹ️</div>
              <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)", marginBottom: "0.5rem" }}>
                Resumen Ejecutivo
              </h2>
              <ul style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 2, paddingLeft: "1rem" }}>
                <li>Nunca vendemos tus datos personales a terceros.</li>
                <li>Usamos cifrado AES-256 para proteger toda tu información.</li>
                <li>Cumplimos con la Ley 1581 de 2012 (Habeas Data Colombia).</li>
                <li>Tienes derecho a acceder, corregir o eliminar tus datos.</li>
              </ul>
            </div>
          </motion.div>

          {/* Content sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {SECTIONS.map((sec, i) => (
              <motion.div key={sec.title} variants={fadeUp} className="card">
                <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--on-surface)", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(190,200,210,0.2)" }}>
                  {sec.title}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {sec.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div variants={fadeUp} style={{ marginTop: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginBottom: "1rem" }}>
              Al utilizar Veltron Capital, confirmas que has leído y aceptado esta Política de Privacidad.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link to="/" className="btn-primary btn-sm" style={{ textDecoration: "none" }}>Volver al inicio</Link>
              <Link to="/register" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>Crear cuenta</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
