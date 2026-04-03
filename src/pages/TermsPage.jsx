import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };

const sections = [
  {
    title: "1. Aceptación de los Términos",
    content: `Al acceder o utilizar los servicios de Veltron Capital ("la Plataforma"), usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestros servicios. Veltron Capital se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios con al menos 30 días de anticipación.`
  },
  {
    title: "2. Descripción del Servicio",
    content: `Veltron Capital opera como un canal de conversión de cupo de tarjeta de crédito a efectivo. El servicio permite a los usuarios solicitar la conversión de un monto disponible en su línea de crédito, el cual es procesado como una compra de servicios y posteriormente transferido al método de pago seleccionado (Nequi, Daviplata o transferencia bancaria), descontando una comisión previamente establecida.\n\nVeltron Capital NO es una entidad financiera, NO capta dinero del público, NO ofrece rendimientos ni inversiones, y NO tiene acceso al saldo o cupo real de la tarjeta del cliente.`
  },
  {
    title: "3. Comisiones y Tarifas",
    content: `La comisión vigente por cada operación de conversión es del 12% del monto solicitado. Este porcentaje se descuenta del monto total antes de la transferencia al usuario.\n\nEjemplo: Si solicitas $1.000.000 COP, se cobra ese monto a tu tarjeta de crédito. Veltron retiene $120.000 COP como comisión y transfiere $880.000 COP a tu cuenta.\n\nVeltron Capital se reserva el derecho de modificar las tarifas, notificando a los usuarios con un mínimo de 15 días de anticipación.`
  },
  {
    title: "4. Requisitos del Usuario",
    content: `Para utilizar la plataforma, el usuario debe:\n\n• Ser mayor de 18 años.\n• Poseer una tarjeta de crédito válida (Visa, Mastercard o American Express) a su nombre.\n• Completar el proceso de verificación de identidad (KYC) con documento de identidad vigente.\n• Proporcionar información veraz y actualizada.\n• Contar con una cuenta bancaria o billetera digital para recibir los fondos.`
  },
  {
    title: "5. Proceso de Verificación KYC",
    content: `Antes de realizar cualquier operación, el usuario debe completar el proceso de verificación KYC (Know Your Customer). Este proceso incluye:\n\n• Fotografía del documento de identidad (cédula de ciudadanía o pasaporte) por ambas caras.\n• Selfie de verificación con el documento.\n• Verificación del número de celular.\n\nVeltron se reserva el derecho de rechazar o solicitar verificación adicional cuando lo considere necesario para la prevención de fraude y lavado de activos.`
  },
  {
    title: "6. Limitaciones del Servicio",
    content: `• Monto mínimo por operación: $100.000 COP.\n• Monto máximo por operación: $5.000.000 COP.\n• Tiempo de procesamiento: 1-5 minutos en horario hábil.\n• Período de refrigeración entre operaciones: 30 minutos.\n• Veltron Capital NO garantiza la disponibilidad ininterrumpida del servicio.\n• La plataforma NO puede verificar el cupo disponible en la tarjeta del usuario. Es responsabilidad del usuario asegurarse de que su tarjeta tenga cupo suficiente.`
  },
  {
    title: "7. Responsabilidades del Usuario",
    content: `El usuario es responsable de:\n\n• Mantener la confidencialidad de sus credenciales de acceso.\n• Asegurarse de que la tarjeta utilizada sea de su propiedad.\n• No utilizar el servicio para actividades ilegales, fraudulentas o que contravengan la normatividad colombiana.\n• Reportar inmediatamente cualquier uso no autorizado de su cuenta.\n• Asumir los intereses y cargos que su entidad bancaria aplique por las compras realizadas con la tarjeta de crédito.`
  },
  {
    title: "8. Política de Devoluciones",
    content: `Una vez procesada y enviada la transferencia al usuario, la operación NO es reversible. En caso de error en los datos del destinatario, el usuario debe contactar a soporte dentro de los primeros 10 minutos posteriores a la solicitud.\n\nSi por algún motivo técnico no se puede completar la transferencia, el cargo a la tarjeta será reversado automáticamente en un plazo de 5-10 días hábiles, según la política del banco emisor.`
  },
  {
    title: "9. Propiedad Intelectual",
    content: `Todos los contenidos de la plataforma — incluyendo diseño, logos, textos, código, interfaces e identidad visual — son propiedad exclusiva de Veltron Capital y están protegidos por las leyes colombianas de propiedad intelectual. Queda prohibida la reproducción total o parcial sin autorización escrita.`
  },
  {
    title: "10. Legislación Aplicable",
    content: `Estos términos se rigen por las leyes de la República de Colombia. Para la resolución de cualquier conflicto, las partes acuerdan someterse a los tribunales competentes de la ciudad de Bogotá, Colombia.\n\nÚltima actualización: Marzo 2025\nContacto legal: legal@veltron.capital`
  },
];

export default function TermsPage() {
  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Disclaimer */}
        <motion.div variants={fadeUp} style={{
          background: "rgba(14,165,233,0.06)",
          borderRadius: 16, padding: "1.25rem 1.5rem",
          display: "flex", alignItems: "flex-start", gap: "0.875rem",
          marginBottom: "2rem",
        }}>
          <span style={{ fontSize: "1.2rem" }}>📋</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--on-surface)", marginBottom: "0.25rem" }}>
              Términos de Servicio de Veltron Capital
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
              Al registrarte y usar nuestra plataforma, aceptas estos términos en su totalidad. Te recomendamos leerlos con atención antes de realizar tu primera operación.
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map(({ title, content }, i) => (
          <motion.div key={i} variants={fadeUp} style={{ marginBottom: "2rem" }}>
            <h3 style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800, fontSize: "1.05rem",
              color: "var(--on-surface)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.3px",
            }}>{title}</h3>
            <div style={{
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}>{content}</div>
          </motion.div>
        ))}

        {/* Footer */}
        <motion.div variants={fadeUp} style={{
          borderTop: "1px solid rgba(190,200,210,0.2)",
          paddingTop: "1.5rem",
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>
            © 2025 Veltron Capital · Bogotá, Colombia
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/privacy" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>Políticas de Privacidad</Link>
            <Link to="/faq" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>Preguntas FAQ</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
