import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const FAQS = [
  {
    category: "Proceso de Retiro",
    icon: "⚡",
    items: [
      {
        q: "¿Cuánto tiempo tarda en llegar el dinero?",
        a: "El proceso es prácticamente instantáneo. Una vez confirmada tu solicitud, el dinero llega a tu cuenta en menos de 5 minutos a través de Nequi, Daviplata o transferencia bancaria estándar."
      },
      {
        q: "¿Cuál es el monto mínimo y máximo de retiro?",
        a: "El monto mínimo de retiro es de $100,000 COP y el máximo depende del cupo disponible en tu tarjeta, con un tope operativo de $5,000,000 COP por transacción."
      },
      {
        q: "¿Puedo hacer múltiples retiros en el mismo día?",
        a: "Sí, puedes realizar múltiples retiros diarios siempre y cuando tu cupo lo permita. Sin embargo, aplicamos un período de refrigeración de 30 minutos entre cada transacción por medidas de seguridad."
      },
    ]
  },
  {
    category: "Seguridad y Verificación",
    icon: "🔐",
    items: [
      {
        q: "¿Es seguro el proceso de pago?",
        a: "Absolutamente. Cada pago se procesa como servicio único a través del checkout seguro de Wompi. Nunca almacenamos datos de tarjetas en nuestros servidores. Utilizamos cifrado AES-256 y cumplimos con el estándar PCI DSS y la regulación Fintech vigente."
      },
      {
        q: "¿Por qué necesito verificar mi identidad (KYC)?",
        a: "El proceso KYC (Know Your Customer) es un requisito legal y nos permite protegerte contra fraudes. Solo tarda unos minutos y te brinda acceso completo a todas las funcionalidades de la plataforma."
      },
      {
        q: "¿Qué pasa si se detecta una transacción sospechosa?",
        a: "Nuestro sistema de monitoreo 24/7 detecta automáticamente patrones inusuales. Si identificamos algo sospechoso, pausamos la transacción y te contactamos de inmediato para verificar tu identidad."
      },
    ]
  },
  {
    category: "Comisiones y Costos",
    icon: "💰",
    items: [
      {
        q: "¿Cuál es la comisión de Veltron Capital?",
        a: "Nuestra comisión es del 12% sobre el monto bruto solicitado. Es una comisión única y transparente, sin cargos ocultos. Siempre podrás ver exactamente cuánto recibirás antes de confirmar."
      },
      {
        q: "¿Hay costos adicionales de transferencia?",
        a: "No. La comisión del 12% incluye todos los costos operativos. Las transferencias a Nequi y Daviplata son siempre gratuitas. Para transferencias bancarias, puede aplicar el costo estándar de tu banco."
      },
    ]
  },
  {
    category: "Cuenta y Perfil",
    icon: "👤",
    items: [
      {
        q: "¿Puedo usar cualquier tarjeta de crédito?",
        a: "Trabajamos con las principales tarjetas de crédito del mercado colombiano: Visa, Mastercard y American Express. La tarjeta debe estar a tu nombre y activa."
      },
      {
        q: "¿Cómo recupero mi contraseña?",
        a: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu correo electrónico. Recibirás un código de 6 dígitos válido por 15 minutos."
      },
    ]
  },
];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 14,
      background: "var(--surface-container-low)",
      overflow: "hidden",
      transition: "all 0.2s",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left",
          padding: "1.125rem 1.25rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "none", border: "none", cursor: "pointer",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--on-surface)", lineHeight: 1.4 }}>{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0, color: open ? "var(--primary)" : "var(--outline)", fontSize: "1.2rem", fontWeight: 400, lineHeight: 1 }}
        >+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              padding: "0 1.25rem 1.25rem",
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              lineHeight: 1.7,
              borderTop: "1px solid rgba(190,200,210,0.2)",
              paddingTop: "1rem",
            }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? FAQS
    : FAQS.filter(cat => cat.category === activeCategory);

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">
        {/* Hero Banner */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(0,101,145,0.06))",
            borderRadius: 20, padding: "2rem 2.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <span className="section-badge">Centro de Ayuda</span>
              <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px", marginBottom: "0.5rem" }}>
                Preguntas Frecuentes
              </h2>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
                Todo lo que necesitas saber sobre Veltron Capital y la operativa de retiros.
              </p>
            </div>
            <div style={{ fontSize: "3.5rem", opacity: 0.6 }}>💬</div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div variants={fadeUp} style={{ marginBottom: "1.5rem" }}>
          <div className="tabs">
            <button className={`tab ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
              Todos
            </button>
            {FAQS.map(cat => (
              <button key={cat.category} className={`tab ${activeCategory === cat.category ? "active" : ""}`} onClick={() => setActiveCategory(cat.category)}>
                {cat.icon} {cat.category.split(" ")[0]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {filtered.map((cat) => (
            <motion.div key={cat.category} variants={fadeUp}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
                <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>
                  {cat.category}
                </h3>
                <span className="chip chip-neutral">{cat.items.length} preguntas</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {cat.items.map((item) => (
                  <AccordionItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div variants={fadeUp} style={{ marginTop: "3rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #006591, #0EA5E9)",
            borderRadius: 20, padding: "2rem 2.5rem",
            color: "white", textAlign: "center",
          }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🤝</div>
            <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.5px" }}>
              ¿No encontraste tu respuesta?
            </h3>
            <p style={{ opacity: 0.85, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Nuestro equipo de soporte está disponible 24/7 para ayudarte.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{
                padding: "0.625rem 1.5rem", borderRadius: 999,
                background: "white", color: "#006591",
                fontWeight: 700, fontSize: "0.875rem",
                border: "none", cursor: "pointer",
              }}>
                💬 Chat en vivo
              </button>
              <button style={{
                padding: "0.625rem 1.5rem", borderRadius: 999,
                background: "rgba(255,255,255,0.15)", color: "white",
                fontWeight: 700, fontSize: "0.875rem",
                border: "1.5px solid rgba(255,255,255,0.3)", cursor: "pointer",
              }}>
                📧 Enviar email
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
