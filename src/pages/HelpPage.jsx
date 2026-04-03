/**
 * HelpPage — Centro de Ayuda unificado
 * FAQ accordion + artículos de ayuda + contacto
 * Full Lucide SVG icon system — no emojis
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Wallet as WalletIcon, MapPin, ShieldCheck, CheckCircle2, Circle,
  MessageCircle, Smartphone, Mail, HeadphonesIcon,
  ChevronDown, ChevronUp, Plus,
  Receipt, Lock, CircleDollarSign, User, AlertCircle,
  Headphones,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const FAQS = [
  {
    category: "Proceso de Retiro",
    Icon: Zap,
    items: [
      { q: "¿Cuánto tiempo tarda en llegar el dinero?", a: "El proceso es prácticamente instantáneo. Una vez confirmada tu solicitud, el dinero llega a tu cuenta en menos de 5 minutos a través de Nequi, Daviplata o transferencia bancaria estándar." },
      { q: "¿Cuál es el monto mínimo y máximo de retiro?", a: "El monto mínimo de retiro es de $100.000 COP y el máximo depende del cupo disponible en tu tarjeta, con un tope operativo de $5.000.000 COP por transacción." },
      { q: "¿Puedo hacer múltiples retiros en el mismo día?", a: "Sí, puedes realizar múltiples retiros siempre y cuando tu cupo lo permita. Aplicamos un período de refrigeración de 30 minutos entre cada transacción por medidas de seguridad." },
    ]
  },
  {
    category: "Seguridad y Verificación",
    Icon: ShieldCheck,
    items: [
      { q: "¿Es seguro el proceso de pago?", a: "Absolutamente. Cada pago se procesa como servicio único a través del checkout seguro de Wompi. Nunca almacenamos datos de tarjetas. Utilizamos cifrado AES-256 y cumplimos con el estándar PCI DSS." },
      { q: "¿Por qué necesito verificar mi identidad (KYC)?", a: "El proceso KYC es un requisito legal y nos permite protegerte contra fraudes. Solo tarda unos minutos y te brinda acceso completo a todas las funcionalidades." },
      { q: "¿Qué pasa si se detecta una transacción sospechosa?", a: "Nuestro sistema de monitoreo 24/7 detecta automáticamente patrones inusuales. Si identificamos algo sospechoso, pausamos la transacción y te contactamos de inmediato." },
    ]
  },
  {
    category: "Comisiones y Costos",
    Icon: CircleDollarSign,
    items: [
      { q: "¿Cuál es la comisión de Veltron Capital?", a: "Nuestra comisión es del 12% sobre el monto bruto solicitado. Es una comisión única y transparente, sin cargos ocultos. Siempre verás exactamente cuánto recibirás antes de confirmar." },
      { q: "¿Hay costos adicionales de transferencia?", a: "No. La comisión del 12% incluye todos los costos operativos. Las transferencias a Nequi y Daviplata son siempre gratuitas. Para transferencias bancarias puede aplicar el costo estándar de tu banco." },
    ]
  },
  {
    category: "Cuenta y Perfil",
    Icon: User,
    items: [
      { q: "¿Puedo usar cualquier tarjeta de crédito?", a: "Trabajamos con las principales tarjetas del mercado colombiano: Visa, Mastercard y American Express. La tarjeta debe estar a tu nombre y activa." },
      { q: "¿Cómo recupero mi contraseña?", a: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu correo. Recibirás un código de 6 dígitos válido por 15 minutos." },
    ]
  },
];

const QUICK_LINKS = [
  { Icon: Zap, title: "Cómo funciona un retiro", desc: "Paso a paso: escribe el monto, confirma y recibe en minutos.", to: "/withdrawal" },
  { Icon: MapPin, title: "Estado de mi retiro", desc: "Consulta el estado de todas tus operaciones anteriores.", to: "/transactions" },
  { Icon: WalletIcon, title: "Cuentas de destino", desc: "Gestiona tus cuentas Nequi, Daviplata o bancarias.", to: "/settings" },
  { Icon: ShieldCheck, title: "Seguridad y KYC", desc: "Cómo protegemos tus datos y verificamos tu identidad.", to: "/kyc" },
];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 14,
      background: open ? "var(--surface-container-lowest)" : "var(--surface-container-low)",
      overflow: "hidden", transition: "all 0.2s",
      boxShadow: open ? "0 4px 16px rgba(19,27,46,0.06)" : "none",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", textAlign: "left", padding: "1.125rem 1.25rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "none", border: "none", cursor: "pointer", gap: "1rem",
      }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--on-surface)", lineHeight: 1.4 }}>{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0, color: open ? "var(--primary)" : "var(--outline)" }}>
          <ChevronDown size={18} strokeWidth={2} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeOut" }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 1.25rem 1.25rem", fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7, borderTop: "1px solid rgba(190,200,210,0.2)", paddingTop: "1rem" }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const totalQuestions = FAQS.reduce((a, c) => a + c.items.length, 0);
  const filteredFaqs = activeCategory === "all" ? FAQS : FAQS.filter(cat => cat.category === activeCategory);

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">

        {/* ═══ HERO ═══ */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            background: "linear-gradient(135deg, #0F172A 0%, #006591 55%, #0EA5E9 100%)",
            borderRadius: 24, padding: "2.25rem 2.5rem", color: "white",
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 56px rgba(0,101,145,0.2)",
          }}>
            <div style={{ position: "absolute", top: -60, right: -40, width: 250, height: 250, background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
                <Headphones size={13} /> Centro de Ayuda
              </div>
              <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.625rem" }}>
                ¿En qué podemos ayudarte?
              </h2>
              <p style={{ fontSize: "0.875rem", opacity: 0.7, maxWidth: 520 }}>
                Encuentra respuestas rápidas, artículos de soporte y canales de contacto directo con nuestro equipo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ QUICK ACCESS ═══ */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {QUICK_LINKS.map(({ Icon, title, desc, to }) => (
              <Link key={title} to={to} style={{
                display: "flex", flexDirection: "column", gap: "0.875rem",
                padding: "1.5rem 1.25rem", borderRadius: 18,
                background: "var(--surface-container-lowest)",
                boxShadow: "0 2px 12px rgba(19,27,46,0.05)",
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(19,27,46,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(19,27,46,0.05)"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} strokeWidth={1.8} style={{ color: "#0EA5E9" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--on-surface)", marginBottom: "0.25rem" }}>{title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ═══ SYSTEM STATUS ═══ */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.875rem",
            padding: "0.875rem 1.25rem", background: "rgba(0,108,73,0.05)",
            borderRadius: 14, border: "1px solid rgba(0,108,73,0.12)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00B17B", boxShadow: "0 0 8px rgba(0,177,123,0.5)", flexShrink: 0 }} />
            <div style={{ fontSize: "0.85rem", color: "var(--on-surface)" }}>
              <strong>Sistema Operativo</strong> · Todos los servicios funcionan con normalidad
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
              <CheckCircle2 size={14} style={{ color: "#00B17B" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)", whiteSpace: "nowrap" }}>Actualizado: hace 2 min</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ FAQ ═══ */}
        <motion.div variants={fadeUp}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--on-surface)", letterSpacing: "-0.5px" }}>
                Preguntas Frecuentes
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>
                {totalQuestions} respuestas sobre el servicio de conversión de cupo a efectivo
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="tabs" style={{ flexWrap: "wrap" }}>
              <button className={`tab ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
                Todos
              </button>
              {FAQS.map(cat => (
                <button key={cat.category} className={`tab ${activeCategory === cat.category ? "active" : ""}`} onClick={() => setActiveCategory(cat.category)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <cat.Icon size={13} strokeWidth={2} />
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Groups */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2.5rem" }}>
            {filteredFaqs.map((cat) => (
              <div key={cat.category}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <cat.Icon size={15} strokeWidth={1.8} style={{ color: "#0EA5E9" }} />
                  </div>
                  <h4 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--on-surface)" }}>
                    {cat.category}
                  </h4>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "rgba(14,165,233,0.08)", color: "var(--primary)" }}>
                    {cat.items.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {cat.items.map(item => <AccordionItem key={item.q} question={item.q} answer={item.a} />)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══ CONTACT CTA ═══ */}
        <motion.div variants={fadeUp}>
          <div style={{
            background: "linear-gradient(135deg, #0F172A, #006591)",
            borderRadius: 22, padding: "2.25rem 2.5rem", color: "white",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.5rem",
          }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem" }}>
                <Headphones size={22} strokeWidth={1.8} />
              </div>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.375rem", letterSpacing: "-0.3px" }}>
                ¿No encontraste tu respuesta?
              </div>
              <div style={{ fontSize: "0.85rem", opacity: 0.7, lineHeight: 1.5 }}>
                Nuestro equipo responde en menos de 5 minutos durante horario hábil.
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { Icon: MessageCircle, label: "Chat en vivo", primary: true },
                { Icon: Smartphone, label: "WhatsApp" },
                { Icon: Mail, label: "soporte@veltron.capital" },
              ].map(({ Icon, label, primary }) => (
                <button key={label} style={{
                  padding: "0.625rem 1.25rem", borderRadius: 999,
                  background: primary ? "white" : "rgba(255,255,255,0.12)",
                  color: primary ? "#006591" : "white",
                  fontWeight: 700, fontSize: "0.82rem",
                  border: primary ? "none" : "1.5px solid rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: primary ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                }}>
                  <Icon size={14} strokeWidth={2} /> {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
