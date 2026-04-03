import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Pages ──────────────────────────────────────────
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import WithdrawalPage from "./pages/WithdrawalPage";
import KYCPage from "./pages/KYCPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";

// ── Icons (inline SVG components) ─────────────────
const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Portfolio: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  Transactions: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  Withdrawal: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  KYC: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  FAQ: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ── Auth-protected layout with sidebar ─────────────
const APP_PAGES = [
  { path: "/dashboard", label: "Panel Principal", icon: Icon.Dashboard },
  { path: "/withdrawal", label: "Nuevo Retiro", icon: Icon.Withdrawal, isKeyAction: true },
  { path: "/transactions", label: "Historial", icon: Icon.Transactions },
  { path: "/kyc", label: "Verificación KYC", icon: Icon.KYC, hasBadge: true },
];

const APP_PAGES_SECONDARY = [
  { path: "/help", label: "Centro de Ayuda", icon: Icon.FAQ },
  { path: "/settings", label: "Mi Perfil", icon: Icon.KYC },
  { path: "/config", label: "Configuración", icon: Icon.Settings },
];

function AppLayout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const pageTitle = {
    "/dashboard": { title: "Panel Principal", sub: "Bienvenido de vuelta, Andrés" },
    "/transactions": { title: "Historial de Retiros", sub: "Registro de todas tus conversiones de cupo a efectivo" },
    "/withdrawal": { title: "Nuevo Retiro", sub: "Convierte tu cupo disponible en efectivo inmediato" },
    "/kyc": { title: "Validación KYC", sub: "Verifica tu identidad para acceso completo" },
    "/settings": { title: "Mi Perfil", sub: "Gestiona tu información personal y seguridad" },
    "/help": { title: "Centro de Ayuda", sub: "Preguntas frecuentes, soporte y canales de contacto" },
    "/config": { title: "Configuración", sub: "Ajustes avanzados de tu cuenta y preferencias" },
  }[location.pathname] || { title: "Detalle de Operación", sub: "Información completa de la transacción" };

  return (
    <div className="app-layout">
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            style={{ position: "fixed", inset: 0, background: "rgba(19,27,46,0.4)", backdropFilter: "blur(4px)", zIndex: 99 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">V</div>
          <div>
            <div className="sidebar-logo-text">VELTRON</div>
            <div className="sidebar-logo-sub">Tu cupo, tu efectivo</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Operaciones</div>
          {APP_PAGES.map((item) => {
            const Ic = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""} ${item.isKeyAction ? "key-action" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="link-icon"><Ic /></span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasBadge && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    background: 'var(--error)', 
                    color: 'white', 
                    borderRadius: '99px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pendiente
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="sidebar-section-label" style={{ marginTop: "var(--spacing-3)" }}>Soporte</div>
          {APP_PAGES_SECONDARY.map((item) => {
            const Ic = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""} ${item.isKeyAction ? "key-action" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="link-icon"><Ic /></span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasBadge && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    background: 'var(--error)', 
                    color: 'white', 
                    borderRadius: '99px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pendiente
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="sidebar-section-label" style={{ marginTop: "var(--spacing-4)" }}>Sistema</div>
          <NavLink
            to="/terms"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="link-icon"><Icon.Settings /></span>
            <span>Términos</span>
          </NavLink>
          <button
            className="sidebar-link"
            style={{ width: "100%", textAlign: "left", color: "var(--error)" }}
            onClick={() => {
              if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                navigate("/login");
              }
            }}
          >
            <span className="link-icon"><Icon.Logout /></span>
            <span>Cerrar Sesión</span>
          </button>
        </nav>

        <div className="sidebar-account">
          <div className="sidebar-user">
            <div className="sidebar-avatar">AC</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Andrés Castillo</div>
              <div className="sidebar-user-role">Cuenta Premium</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-content">
        {/* Header */}
        <header className="page-header">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-4)" }}>
            <button
              className="notification-btn"
              style={{ display: "none" }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Icon.Menu />
            </button>
            <div className="page-header-left">
              <h1>{pageTitle.title}</h1>
              {pageTitle.sub && <p>{pageTitle.sub}</p>}
            </div>
          </div>
          <div className="page-header-right">
            <div className="header-badge">
              <span className="dot" />
              KYC Verificado
            </div>
            <button className="notification-btn" aria-label="Notificaciones">
              <Icon.Bell />
              <span className="notification-dot" />
            </button>
            {/* Avatar con dropdown */}
            <div style={{ position: "relative" }}>
              <div
                className="sidebar-avatar"
                style={{ cursor: "pointer" }}
                onClick={() => setAvatarMenuOpen(o => !o)}
              >AC</div>
              <AnimatePresence>
                {avatarMenuOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={() => setAvatarMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute", top: "calc(100% + 8px)", right: 0,
                        width: 260,
                        background: "var(--surface-container-lowest, white)",
                        borderRadius: 16,
                        boxShadow: "0 16px 48px rgba(19,27,46,0.18)",
                        zIndex: 200,
                        overflow: "hidden",
                      }}
                    >
                      {/* User info */}
                      <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid rgba(190,200,210,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: "50%",
                            background: "linear-gradient(135deg, #006591, #0EA5E9)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: 800, fontSize: "0.85rem",
                          }}>AC</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--on-surface)" }}>Andrés Castillo</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)" }}>andres@email.com</div>
                          </div>
                        </div>
                      </div>
                      {/* Menu links */}
                      <div style={{ padding: "0.5rem" }}>
                        {[
                          { icon: "👤", label: "Mi Perfil", to: "/settings" },
                          { icon: "⚙️", label: "Configuración", to: "/config" },
                          { icon: "📋", label: "Términos de Servicio", to: "/terms" },
                        ].map(({ icon, label, to }) => (
                          <button
                            key={to}
                            onClick={() => { navigate(to); setAvatarMenuOpen(false); }}
                            style={{
                              width: "100%", padding: "0.625rem 0.875rem",
                              background: "transparent", border: "none",
                              display: "flex", alignItems: "center", gap: "0.625rem",
                              borderRadius: 10, cursor: "pointer",
                              fontSize: "0.82rem", color: "var(--on-surface)",
                              transition: "background 0.15s",
                              textAlign: "left",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-container-low, #f1f5f9)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <span>{icon}</span>
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                      {/* Logout */}
                      <div style={{ padding: "0.5rem", borderTop: "1px solid rgba(190,200,210,0.15)" }}>
                        <button
                          onClick={() => {
                            setAvatarMenuOpen(false);
                            if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                              navigate("/login");
                            }
                          }}
                          style={{
                            width: "100%", padding: "0.625rem 0.875rem",
                            background: "transparent", border: "none",
                            display: "flex", alignItems: "center", gap: "0.625rem",
                            borderRadius: 10, cursor: "pointer",
                            fontSize: "0.82rem", color: "var(--error, #BA1A1A)",
                            fontWeight: 600,
                            transition: "background 0.15s",
                            textAlign: "left",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(186,26,26,0.06)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span>🚪</span>
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/transactions/:id" element={<TransactionDetailPage />} />
                <Route path="/withdrawal" element={<WithdrawalPage />} />
                <Route path="/kyc" element={<KYCPage />} />
                <Route path="/faq" element={<HelpPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/config" element={<HelpPage />} />
                <Route path="/terms" element={<TermsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Chat Concierge Flotante ── */}
      <ChatConcierge />
    </div>
  );
}

// ── Root App ────────────────────────────────────────
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Which routes use the full app layout (with sidebar)
  const isAppRoute = ["/dashboard", "/transactions", "/withdrawal", "/kyc", "/faq", "/settings", "/help", "/config", "/terms"].some(
    (p) => location.pathname.startsWith(p)
  );

  return (
    <AnimatePresence mode="wait">
      {isAppRoute ? (
        <AppLayout
          key="app"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        <motion.div
          key="public"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   Chat Concierge — Floating Widget
───────────────────────────────────────────────────── */
function ChatConcierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! 👋 Soy el asistente de Veltron Capital. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");

  const botReplies = [
    "Tu retiro está siendo procesado. Debería llegar en menos de 5 minutos.",
    "La comisión estándar de Veltron es del 12% sobre el monto solicitado.",
    "Cada operación se procesa como pago de servicio único vía checkout Wompi. No necesitas vincular tarjetas.",
    "Si necesitas ayuda adicional, puedes escribirnos por WhatsApp al +57 310 000 0000.",
    "Tu verificación KYC está activa. Tienes acceso completo a todos los servicios.",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            style={{
              position: "fixed", bottom: 96, right: 24,
              width: 360, maxHeight: 480,
              background: "var(--surface-container-lowest, white)",
              borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              zIndex: 1001,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #0F172A, #006591)",
              padding: "1rem 1.25rem", color: "white",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.9rem" }}>Asistente Virtual</div>
                <div style={{ fontSize: "0.68rem", opacity: 0.6 }}>Respuesta en menos de 5 min</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: "0.8rem" }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: 14,
                    maxWidth: "85%",
                    fontSize: "0.82rem", lineHeight: 1.5,
                    ...(m.from === "user" ? {
                      alignSelf: "flex-end",
                      background: "linear-gradient(135deg, #006591, #0EA5E9)",
                      color: "white",
                      borderBottomRightRadius: 4,
                    } : {
                      alignSelf: "flex-start",
                      background: "var(--surface-container-low, #f1f5f9)",
                      color: "var(--on-surface, #131b2e)",
                      borderBottomLeftRadius: 4,
                    }),
                  }}
                >{m.text}</motion.div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(190,200,210,0.15)", display: "flex", gap: "0.5rem" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu mensaje…"
                style={{
                  flex: 1, padding: "0.6rem 1rem", borderRadius: 99,
                  border: "1.5px solid var(--outline-variant, #ccc)",
                  background: "transparent", fontSize: "0.82rem",
                  outline: "none", color: "var(--on-surface, #131b2e)",
                }}
              />
              <button onClick={handleSend} style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #006591, #0EA5E9)",
                border: "none", color: "white", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", flexShrink: 0,
              }}>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #006591, #0EA5E9)",
          border: "none", color: "white",
          boxShadow: "0 8px 32px rgba(0,101,145,0.4)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem",
          zIndex: 1002,
        }}
      >
        {open ? "✕" : "💬"}
      </motion.button>
    </>
  );
}
