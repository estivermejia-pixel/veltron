import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const smooth = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, transition: "all 0.3s" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: scrolled ? "0.75rem 2.5rem" : "1.25rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(250,248,255,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderRadius: scrolled ? "0 0 1rem 1rem" : "0",
        boxShadow: scrolled ? "0 4px 24px rgba(19,27,46,0.06)" : "none",
        transition: "all 0.4s ease",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #006591, #0EA5E9)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 14 }}>V</div>
          <div>
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#131b2e", letterSpacing: "-0.5px" }}>VELTRON<span style={{ color: "#0EA5E9" }}>.</span></div>
            <div style={{ fontSize: "0.6rem", color: "#3e4850", fontWeight: 500, letterSpacing: "0.5px" }}>CAPITAL</div>
          </div>
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: "0.25rem", listStyle: "none", padding: 0, margin: 0 }}>
          {[["inicio", "Simulador"], ["como-funciona", "Cómo Funciona"], ["seguridad", "Seguridad"]].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => smooth(e, id)} style={{ padding: "0.5rem 1rem", borderRadius: 999, fontSize: "0.875rem", fontWeight: 500, color: "#3e4850", transition: "all 0.2s", display: "block" }}
                onMouseEnter={e => { e.target.style.background = "var(--surface-container-low)"; e.target.style.color = "#131b2e"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#3e4850"; }}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link to="/login" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>Iniciar Sesión</Link>
          <Link to="/register" className="btn-primary btn-sm" style={{ textDecoration: "none" }}>Crear Cuenta</Link>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO — simulador compacto glassmorphic
══════════════════════════════════════════ */
function HeroSection() {
  const { scrollY } = useScroll();
  useTransform(scrollY, [0, 400], [0, -80]);

  const [heroAmount, setHeroAmount] = useState(500000);
  const [heroCtaHov, setHeroCtaHov] = useState(false);
  const HERO_MIN = 100000, HERO_MAX = 5000000;
  const heroCommission = Math.round(heroAmount * 0.12);
  const heroNet = heroAmount - heroCommission;
  const heroPct = ((heroAmount - HERO_MIN) / (HERO_MAX - HERO_MIN)) * 100;
  const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

  return (
    <section id="inicio" style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #faf8ff 0%, #eaedff 50%, #dae2fd 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "8rem 2.5rem 5rem", position: "relative", overflow: "hidden",
    }}>
      {/* bg orbs */}
      <div style={{ position: "absolute", top: "8%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "3%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,101,145,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

        {/* ── LEFT ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.375rem 1rem", background: "rgba(14,165,233,0.1)", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#006591", marginBottom: "1.5rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0EA5E9", boxShadow: "0 0 8px #0EA5E9", animation: "pulse-glow 2s infinite" }} />
              Efectivo Inmediato Desde Tu Tarjeta
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "#131b2e", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "1.5rem" }}>
            Tu cupo,<br />
            <span style={{ background: "linear-gradient(135deg, #006591, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tu efectivo.</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: "1.05rem", color: "#3e4850", lineHeight: 1.7, maxWidth: 460, marginBottom: "2rem" }}>
            Transforma el cupo de tu tarjeta de crédito en efectivo al instante.
            Comisión fija del 12%, sin costos ocultos, en menos de 5 minutos.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <a href="#como-funciona" className="btn-outline btn-lg"
              onClick={e => { e.preventDefault(); document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" }); }}>
              ¿Cómo funciona?
            </a>
            <Link to="/register" className="btn-primary btn-lg" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Crear cuenta gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { val: "< 5 min", label: "Tiempo de envío", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
              { val: "12%", label: "Comisión fija", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg> },
              { val: "100%", label: "Cifrado seguro", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
            ].map(({ val, label, icon }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "1rem 1.25rem", boxShadow: "0 4px 16px rgba(19,27,46,0.06)" }}>
                <div style={{ marginBottom: 6 }}>{icon}</div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#131b2e", letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: "0.7rem", color: "#3e4850", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Glass Simulator ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          style={{ position: "relative" }}
        >
          <div style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.75)",
            boxShadow: "0 20px 60px rgba(19,27,46,0.15), 0 4px 16px rgba(14,165,233,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
            padding: "1.5rem 1.75rem",
            position: "relative", overflow: "hidden",
          }}>
            {/* subtle inner glow */}
            <div style={{ position: "absolute", top: -60, left: -60, width: 180, height: 180, background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Title block */}
            <div style={{ marginBottom: "0.875rem", position: "relative" }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#0EA5E9", marginBottom: "0.2rem" }}>
                Simulador
              </div>
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#131b2e", letterSpacing: "-0.3px" }}>
                Elige cuánto efectivo necesitas
              </div>
              <div style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#9eaab2", marginTop: "0.15rem" }}>
                Mueve el slider y ve exactamente cuánto recibirás
              </div>
            </div>

            {/* Amount */}
            <motion.div key={heroAmount} initial={{ opacity: 0.7, y: -2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}
              style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(2rem, 4.5vw, 2.75rem)", fontWeight: 800, color: "#131b2e", letterSpacing: "-2px", lineHeight: 1, marginBottom: "1rem" }}>
              {fmt(heroAmount)}
            </motion.div>

            {/* Slider */}
            <div style={{ marginBottom: "1.125rem" }}>
              <style>{`
                #hs { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 99px; outline: none; cursor: pointer; background: linear-gradient(90deg, #0EA5E9 ${heroPct}%, rgba(14,165,233,0.18) ${heroPct}%); }
                #hs::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #0EA5E9; border: 3px solid white; box-shadow: 0 0 0 3px rgba(14,165,233,0.22), 0 2px 8px rgba(14,165,233,0.45); cursor: pointer; }
                #hs::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #0EA5E9; border: 3px solid white; cursor: pointer; }
              `}</style>
              <input id="hs" type="range" min={HERO_MIN} max={HERO_MAX} step={50000}
                value={heroAmount} onChange={e => setHeroAmount(Number(e.target.value))} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
                <span style={{ fontSize: "0.62rem", color: "#b0bec5", fontWeight: 600 }}>$50.000</span>
                <span style={{ fontSize: "0.62rem", color: "#b0bec5", fontWeight: 600 }}>$5.000.000</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(190,200,210,0.3)", marginBottom: "1rem" }} />

            {/* Commission */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#6e7881" }}>Comisión Veltron (12%)</span>
              <motion.span key={heroCommission} initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ba1a1a" }}>
                -{fmt(heroCommission)}
              </motion.span>
            </div>

            {/* Net */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.875rem", background: "rgba(14,165,233,0.07)", borderRadius: 12, marginBottom: "1.125rem" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#131b2e" }}>Recibes en tu cuenta</span>
              <motion.span key={heroNet} initial={{ scale: 1.1, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#006591", letterSpacing: "-0.5px" }}>
                {fmt(heroNet)}
              </motion.span>
            </div>

            {/* CTA */}
            <Link to="/login"
              onMouseEnter={() => setHeroCtaHov(true)}
              onMouseLeave={() => setHeroCtaHov(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                width: "100%", padding: "0.75rem", borderRadius: 12,
                background: "linear-gradient(135deg, #006591, #0EA5E9)",
                color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "0.9rem",
                textDecoration: "none", boxSizing: "border-box", transition: "all 0.2s",
                boxShadow: heroCtaHov ? "0 0 0 3px rgba(14,165,233,0.2), 0 8px 24px rgba(14,165,233,0.45)" : "0 4px 16px rgba(14,165,233,0.35)",
                transform: heroCtaHov ? "translateY(-1px)" : "none",
              }}>
              <motion.span key={heroCtaHov ? "h" : "d"} initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
                {heroCtaHov ? "Iniciar para Retirar →" : "Obtener Efectivo →"}
              </motion.span>
            </Link>

            <p style={{ textAlign: "center", marginTop: "0.6rem", fontSize: "0.67rem", color: "#b0bec5", fontWeight: 500 }}>
              Envío via Nequi · Daviplata · Transferencia bancaria
            </p>
          </div>

          {/* Trust strip */}
          <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", borderRadius: 10 }}>
            {[
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006C49" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "PCI DSS" },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006C49" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, text: "AES-256" },
              { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#006C49" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, text: "< 5 min" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.67rem", fontWeight: 700, color: "#006C49" }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Scroll arrow */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", color: "#6e7881", opacity: 0.6 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════
   STEPS
══════════════════════════════════════════ */
function StepsSection() {
  const steps = [
    { step: "01", title: "Crea tu cuenta", desc: "Regístrate en menos de 2 minutos con tu correo y celular.", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { step: "02", title: "Verifica tu identidad", desc: "Sube tu cédula. Validamos que el titular coincida con la tarjeta y la cuenta destino.", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
    { step: "03", title: "Elige tu monto", desc: "Selecciona cuánto necesitas. Procesamos el cobro como pago de servicio único vía Wompi.", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
    { step: "04", title: "Recibe tu dinero", desc: "En menos de 5 minutos el dinero llega a tu Nequi, Daviplata o cuenta bancaria.", icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg> },
  ];

  return (
    <section id="como-funciona" style={{ padding: "6rem 2.5rem", background: "linear-gradient(160deg, #eaedff 0%, #f2f3ff 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-badge" style={{ margin: "0 auto 1rem" }}>Así de Simple</span>
            <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#131b2e", letterSpacing: "-1.5px", marginBottom: "0.75rem" }}>Cuatro pasos, efectivo real</h2>
            <p style={{ color: "#3e4850", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>Convierte el cupo de tu tarjeta de crédito en dinero disponible en tu cuenta. Sin intermediarios bancarios, sin trámites engorrosos.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {steps.map(({ step, title, desc, icon }, i) => (
              <motion.div key={step} variants={fadeUp} style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(19,27,46,0.06)", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(19,27,46,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(19,27,46,0.06)"; }}>
                <div style={{ marginBottom: "1rem" }}>{icon}</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#0EA5E9", marginBottom: "0.5rem" }}>PASO {`0${i + 1}`}</div>
                <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#131b2e", marginBottom: "0.75rem", letterSpacing: "-0.3px" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#3e4850", lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SECURITY
══════════════════════════════════════════ */
function SecuritySection() {
  const features = [
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, title: "Encriptación AES-256", desc: "Tus datos nunca son compartidos ni almacenados en servidores externos." },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: "Regulación Fintech", desc: "Operamos bajo los más estrictos marcos legales de servicios digitales." },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, title: "Biometría Activa", desc: "Validación de identidad en tiempo real para prevenir fraude." },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>, title: "PCI DSS Compliant", desc: "Certificación internacional en el manejo de tarjetas de crédito." },
  ];

  return (
    <section id="seguridad" style={{ padding: "6rem 2.5rem", background: "var(--surface-container-lowest)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-badge" style={{ margin: "0 auto 1rem" }}>Tu Seguridad es Primero</span>
            <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#131b2e", letterSpacing: "-1.5px", marginBottom: "0.75rem" }}>
              Tu seguridad es <span style={{ background: "linear-gradient(135deg, #006591, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>prioridad</span>
            </h2>
            <p style={{ color: "#3e4850", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>Protocolos de nivel bancario para que operes con total tranquilidad financiera.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {features.map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", background: "var(--surface-container-low)", borderRadius: 16, padding: "1.75rem" }}>
                <div style={{ width: 48, height: 48, flexShrink: 0, background: "rgba(14,165,233,0.1)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                <div>
                  <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#131b2e", marginBottom: "0.4rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#3e4850", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CTA
══════════════════════════════════════════ */
function CtaSection() {
  return (
    <section style={{ padding: "6rem 2.5rem", background: "linear-gradient(160deg, #eaedff 0%, #dae2fd 100%)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, color: "#131b2e", letterSpacing: "-2px", marginBottom: "1rem" }}>
            ¿Listo para liberar tu capital?
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: "1rem", color: "#3e4850", marginBottom: "2.5rem" }}>
            Únete a miles de usuarios que confían en Veltron Capital para obtener capital inmediato.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary btn-lg" style={{ textDecoration: "none" }}>Crear Cuenta Gratis</Link>
            <Link to="/login" className="btn-outline btn-lg" style={{ textDecoration: "none" }}>Iniciar Sesión</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function LandingFooter() {
  return (
    <footer style={{ padding: "3rem 2.5rem", background: "var(--on-surface)", color: "rgba(255,255,255,0.6)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #006591, #0EA5E9)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12, fontFamily: "Manrope, sans-serif" }}>V</div>
          <span style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>VELTRON<span style={{ color: "#0EA5E9" }}>.</span></span>
        </div>
        <nav style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[["Privacidad", "/privacy"], ["Términos", "/terms"], ["Seguridad", "#seguridad"], ["Ayuda", "/help"]].map(([label, href]) => (
            <Link key={label} to={href} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>
              {label}
            </Link>
          ))}
        </nav>
        <p style={{ fontSize: "0.75rem" }}>© 2025 Veltron Capital · Canal de conversión de cupo a efectivo · Bogotá, Colombia</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <StepsSection />
      <SecuritySection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
