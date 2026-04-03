import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ── Helpers ── */
const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

/* ── Constants ── */
const COMMISSION_RATE = 0.12;
const QUICK_AMOUNTS = [200000, 500000, 1000000, 2000000];
const MIN = 100000;
const MAX = 5000000;



const BANKS = ["Banco de Bogotá", "Davivienda", "Bancolombia", "BBVA", "Nequi", "Daviplata"];



/* ── Step Indicator ── */
const STEPS = ["Monto", "Cuenta", "Confirmación", "Completado"];

function StepDot({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: "0.85rem",
        background: done ? "#006C49" : active ? "linear-gradient(135deg, #006591, #0EA5E9)" : "var(--surface-container-high)",
        color: done || active ? "white" : "var(--on-surface-variant)",
        boxShadow: active ? "0 0 0 5px rgba(14,165,233,0.18)" : "none",
        transition: "all 0.3s",
      }}>
        {done ? "✓" : step + 1}
      </div>
      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: active ? "var(--primary)" : "var(--on-surface-variant)", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WithdrawalPage Component
   ═══════════════════════════════════════════════════ */
export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(500000);
  const [bankForm, setBankForm] = useState({ bank: "", account: "", holder: "" });
  const [legalChecked, setLegalChecked] = useState(false);
  const refCode = `VC-${Date.now().toString().slice(-6)}`;

  const commission = amount * COMMISSION_RATE;
  const net = amount - commission;
  const pct = ((amount - MIN) / (MAX - MIN)) * 100;

  /* ── Inline style objects (light banking/corporate theme) ── */
  const styles = {
    /* Calculator card */
    calcCard: {
      background: "#ffffff",
      borderRadius: 16,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
      overflow: "hidden",
    },
    calcHeader: {
      display: "flex", alignItems: "center", gap: 6,
      padding: "0.875rem 1.25rem",
      borderBottom: "1px solid #f0f2f5",
      fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "1px", textTransform: "uppercase", color: "#1e3a5f",
    },
    calcBody: {
      padding: "1rem 1.25rem",
    },



    /* Amount display */
    amountBox: {
      background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
      borderRadius: 12, border: "1px solid #e2e8f0",
      padding: "1rem 1.25rem", textAlign: "left",
      marginTop: "1rem", marginBottom: "0.875rem",
    },
    amountQuestion: {
      fontSize: "0.75rem", color: "#64748b", fontWeight: 500,
      marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: 6,
    },
    amountValue: {
      fontFamily: "'Manrope', sans-serif", fontSize: "2.25rem", fontWeight: 800,
      color: "#0f172a", letterSpacing: "-1px", lineHeight: 1,
    },

    /* Quick amount buttons */
    quickBtnRow: {
      display: "flex", gap: "0.4rem", flexWrap: "wrap",
      marginBottom: "1rem",
    },
    quickBtn: (isActive) => ({
      padding: "0.4rem 0.875rem", borderRadius: 99,
      border: isActive ? "2px solid #0EA5E9" : "2px solid #1e3a5f",
      background: isActive ? "#0F172A" : "#1e3a5f", color: "white",
      fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease",
      boxShadow: isActive ? "0 0 0 3px rgba(14,165,233,0.2)" : "none",
      opacity: isActive ? 1 : 0.7,
    }),

    /* CTA button */
    ctaBtn: {
      width: "100%", padding: "0.875rem", borderRadius: 12, border: "none",
      background: "linear-gradient(135deg, #0F172A 0%, #006591 55%, #0EA5E9 100%)",
      color: "white", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      boxShadow: "0 6px 16px rgba(15,23,42,0.25)", transition: "all 0.25s ease",
      letterSpacing: "0.2px",
    },

    /* Summary card */
    summaryCard: {
      background: "#ffffff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 2px 20px rgba(0,0,0,0.05)", overflow: "hidden",
    },
    summaryHeader: {
      display: "flex", alignItems: "center", gap: 6,
      padding: "0.875rem 1.25rem", borderBottom: "1px solid #f0f2f5",
      fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px",
      textTransform: "uppercase", color: "#1e3a5f",
    },
    summaryBody: {
      padding: "1rem 1.25rem",
    },
    summaryRow: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "0.6rem",
    },
    summaryLabel: { fontSize: "0.8rem", color: "#64748b", fontWeight: 500 },
    summaryValue: { fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" },
    summaryDivider: { height: 1, background: "#f0f2f5", margin: "0.6rem 0" },
    summaryTotal: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    summaryTotalLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" },
    summaryTotalValue: {
      fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 800,
      color: "#16a34a", letterSpacing: "-0.5px",
    },
    infoRow: {
      display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem",
      color: "#64748b", fontWeight: 500, marginBottom: "0.25rem",
    },
  };

  return (
    <div className="page-content">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Step Indicator */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <StepDot step={i} current={step} label={label} />
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: "var(--outline-variant)", borderRadius: 1, overflow: "hidden", margin: "0 0.5rem", marginBottom: "1.25rem" }}>
                    <div style={{ height: "100%", background: step > i ? "#006C49" : "transparent", transition: "width 0.4s ease", width: step > i ? "100%" : "0%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ Step 0 — Monto (Calculadora de Retiro + Resumen) ═══ */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.25rem", alignItems: "start" }}>

                {/* ── Left: Calculator Card ── */}
                <div style={styles.calcCard}>
                  {/* Header */}
                  <div style={styles.calcHeader}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(14,165,233,0.1)" }}>
                      <CalcIcon />
                    </div>
                    CALCULADORA DE RETIRO
                  </div>

                  {/* Body */}
                  <div style={styles.calcBody}>
                    {/* Amount Display */}
                    <div style={styles.amountBox}>
                      <div style={styles.amountQuestion}>
                        <span>✨</span>
                        ¿Cuánto efectivo necesitas hoy?
                      </div>
                      <motion.div
                        key={amount}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={styles.amountValue}
                      >
                        {fmt(amount)}
                      </motion.div>
                    </div>

                    {/* Slider */}
                    <div style={{ marginBottom: "1rem" }}>
                      <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={50000}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        style={{
                          width: "100%",
                          appearance: "none",
                          WebkitAppearance: "none",
                          height: 6,
                          borderRadius: 99,
                          outline: "none",
                          cursor: "pointer",
                          background: `linear-gradient(90deg, #0F172A ${pct}%, #e2e8f0 ${pct}%)`,
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>$ 100.000</span>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>$ 5.000.000</span>
                      </div>
                    </div>

                    {/* Quick Amounts */}
                    <div style={styles.quickBtnRow}>
                      {QUICK_AMOUNTS.map((a) => (
                        <motion.button
                          key={a}
                          whileHover={{ scale: 1.03, opacity: 1 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            padding: "0.5rem 1.125rem",
                            borderRadius: 99,
                            border: amount === a ? "2px solid #0EA5E9" : "2px solid #1e3a5f",
                            background: amount === a ? "#0F172A" : "#1e3a5f",
                            color: "white",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: amount === a ? "0 0 0 3px rgba(14,165,233,0.2)" : "none",
                            opacity: amount === a ? 1 : 0.7,
                          }}
                          onClick={() => setAmount(a)}
                        >
                          {fmt(a)}
                        </motion.button>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ transform: "translateY(-2px)", boxShadow: "0 12px 32px rgba(15,23,42,0.4)" }}
                      whileTap={{ transform: "translateY(0)" }}
                      style={{
                        width: "100%",
                        padding: "1rem 1.5rem",
                        borderRadius: 14,
                        border: "none",
                        background: "linear-gradient(135deg, #0F172A 0%, #006591 55%, #0EA5E9 100%)",
                        color: "white",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 8px 24px rgba(15,23,42,0.3)",
                        transition: "all 0.25s ease",
                        letterSpacing: "0.2px",
                      }}
                      onClick={() => setStep(1)}
                    >
                      Pagar Servicio y Recibir {fmt(net)}
                      <span style={{ fontSize: "1.1rem" }}>→</span>
                    </motion.button>
                  </div>
                </div>

                {/* ── Right: Summary Panel ── */}
                <div>
                  <div style={styles.summaryCard}>
                    {/* Header */}
                    <div style={styles.summaryHeader}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(14,165,233,0.1)" }}>
                        <SummaryIcon />
                      </div>
                      RESUMEN DE LA OPERACIÓN
                    </div>

                    {/* Body */}
                    <div style={styles.summaryBody}>
                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Subtotal</span>
                        <span style={styles.summaryValue}>{fmt(amount)}</span>
                      </div>
                      <div style={styles.summaryRow}>
                        <span style={styles.summaryLabel}>Gestión Veltron (12%)</span>
                        <span style={{ ...styles.summaryValue, color: "#ef4444" }}>-{fmt(commission)}</span>
                      </div>

                      <div style={styles.summaryDivider} />

                      <div style={styles.summaryTotal}>
                        <span style={styles.summaryTotalLabel}>Total a Recibir</span>
                        <motion.span
                          key={net}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={styles.summaryTotalValue}
                        >
                          {fmt(net)}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Info bullets */}
                  <div style={{ marginTop: "1.25rem", padding: "0 0.375rem" }}>
                    <div style={styles.infoRow}>
                      <CheckCircle />
                      Envío vía Nequi, Daviplata o transferencia
                    </div>
                    <div style={styles.infoRow}>
                      <CheckCircle />
                      Procesamiento en menos de 15 minutos
                    </div>
                    <div style={styles.infoRow}>
                      <CheckCircle />
                      Pago procesado por pasarela Wompi
                    </div>
                  </div>

                  {/* Security badge */}
                  <div style={{
                    marginTop: "1rem",
                    padding: "0.875rem 1rem",
                    borderRadius: 12,
                    background: "rgba(22,163,74,0.05)",
                    border: "1px solid rgba(22,163,74,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <span style={{ fontSize: "1rem" }}>🔒</span>
                    <span style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 600 }}>
                      Transacción protegida con cifrado AES-256
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Step 1 — Cuenta Destino ═══ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.25rem", alignItems: "start" }}>
                <div style={styles.calcCard}>
                  <div style={styles.calcHeader}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(14,165,233,0.1)" }}>
                      <CardIcon />
                    </div>
                    CUENTA DESTINO
                  </div>
                  <div style={styles.calcBody}>
                    <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "0.375rem" }}>
                      ¿A dónde enviamos tu retiro?
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
                      Selecciona o ingresa los datos de tu cuenta bancaria
                    </p>

                    {/* Quick options */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      {["Nequi", "Daviplata", "Transferencia"].map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setBankForm({ ...bankForm, bank: opt })}
                          style={{
                            padding: "1rem", borderRadius: 14,
                            border: `2px solid ${bankForm.bank === opt ? "#0EA5E9" : "transparent"}`,
                            background: bankForm.bank === opt ? "rgba(14,165,233,0.06)" : "#f8fafc",
                            cursor: "pointer", transition: "all 0.2s",
                            fontWeight: 600, fontSize: "0.85rem",
                            color: bankForm.bank === opt ? "#0284c7" : "#64748b",
                            width: "100%",
                            textTransform: "none",
                            letterSpacing: "0",
                            boxShadow: bankForm.bank === opt ? "0 4px 12px rgba(14,165,233,0.15)" : "none",
                          }}
                        >
                          {opt === "Nequi" ? "💜" : opt === "Daviplata" ? "🟡" : "🏦"} {opt}
                        </motion.button>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div>
                        <label className="input-label">Banco / Entidad</label>
                        <select className="input-field" value={bankForm.bank} onChange={e => setBankForm({ ...bankForm, bank: e.target.value })}>
                          <option value="">Selecciona tu banco</option>
                          {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Número de Cuenta</label>
                        <input className="input-field" placeholder="0000 0000 0000" value={bankForm.account} onChange={e => setBankForm({ ...bankForm, account: e.target.value })} />
                      </div>
                      <div>
                        <label className="input-label">Titular de la Cuenta</label>
                        <input className="input-field" placeholder="Nombre completo del titular" value={bankForm.holder} onChange={e => setBankForm({ ...bankForm, holder: e.target.value })} />
                      </div>
                    </div>

                    <div style={{ marginTop: "1.25rem", background: "rgba(14,165,233,0.04)", borderRadius: 14, padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(14,165,233,0.08)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        El titular de la cuenta debe coincidir con tu documento de identidad registrado.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right summary */}
                <div style={styles.summaryCard}>
                  <div style={styles.summaryHeader}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(14,165,233,0.1)" }}>
                      <SummaryIcon />
                    </div>
                    RESUMEN DE LA OPERACIÓN
                  </div>
                  <div style={styles.summaryBody}>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Subtotal</span>
                      <span style={styles.summaryValue}>{fmt(amount)}</span>
                    </div>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Gestión Veltron (12%)</span>
                      <span style={{ ...styles.summaryValue, color: "#ef4444" }}>-{fmt(commission)}</span>
                    </div>
                    <div style={styles.summaryDivider} />
                    <div style={styles.summaryTotal}>
                      <span style={styles.summaryTotalLabel}>Total a Recibir</span>
                      <span style={styles.summaryTotalValue}>{fmt(net)}</span>
                    </div>
                    <div style={{ ...styles.summaryDivider, margin: "1rem 0" }} />
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Destino</span>
                      <span style={styles.summaryValue}>{bankForm.bank || "Sin seleccionar"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                <button className="btn-ghost" onClick={() => setStep(0)} style={{ width: "auto", textTransform: "none", letterSpacing: 0, boxShadow: "none", background: "transparent" }}>← Volver</button>
                <button className="btn-primary" onClick={() => setStep(2)} disabled={!bankForm.bank || !bankForm.account} style={{ width: "auto" }}>
                  Revisar solicitud →
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ Step 2 — Confirmación ═══ */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.25rem", alignItems: "start" }}>
                <div style={styles.calcCard}>
                  <div style={styles.calcHeader}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(22,163,74,0.1)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    CONFIRMAR SOLICITUD
                  </div>
                  <div style={styles.calcBody}>
                    <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "0.375rem" }}>
                      Revisa los detalles
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
                      Verifica que toda la información sea correcta antes de confirmar.
                    </p>

                    <div style={{ background: "#f8fafc", borderRadius: 16, padding: "1.5rem", border: "1px solid #e2e8f0" }}>
                      {[
                        ["Monto solicitado", fmt(amount)],
                        ["Comisión (12%)", `-${fmt(commission)}`, "error"],
                        ["Monto a recibir", fmt(net), "success"],
                        ["—", null],
                        ["Banco / Entidad", bankForm.bank],
                        ["Número de cuenta", bankForm.account],
                        ["Titular", bankForm.holder || "Andrés Castillo"],
                        ["Tiempo estimado", "< 5 minutos"],
                        ["Medio de pago", "Checkout seguro Wompi"],
                      ].map(([label, val, variant]) => {
                        if (val === null) return <div key={label} style={{ height: 1, background: "#e2e8f0", margin: "0.75rem 0" }} />;
                        return (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{label}</span>
                            <span style={{
                              fontWeight: variant === "success" ? 800 : 600,
                              color: variant === "success" ? "#16a34a" : variant === "error" ? "#ef4444" : "#1e293b",
                              fontFamily: variant === "success" ? "Manrope, sans-serif" : "inherit",
                              fontSize: variant === "success" ? "1.15rem" : "0.85rem",
                            }}>{val}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(22,163,74,0.05)", padding: "0.875rem 1rem", borderRadius: 12, marginTop: "1.25rem", border: "1px solid rgba(22,163,74,0.1)" }}>
                      <span>🔒</span>
                      <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        Transacción protegida con cifrado AES-256. Verificaremos tu biometría antes de procesar.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right summary */}
                <div style={styles.summaryCard}>
                  <div style={styles.summaryHeader}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: "rgba(14,165,233,0.1)" }}>
                      <SummaryIcon />
                    </div>
                    TICKET DE OPERACIÓN
                  </div>
                  <div style={styles.summaryBody}>
                    {/* Ref number */}
                    <div style={{ textAlign: "center", padding: "0.5rem 0 0.75rem", borderBottom: "1px dashed #e2e8f0", marginBottom: "0.75rem" }}>
                      <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 2 }}>Referencia</div>
                      <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem", color: "#0f172a", letterSpacing: "1px" }}>{refCode}</div>
                    </div>
                    {/* Amount */}
                    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#64748b", marginBottom: "0.2rem" }}>Recibirás</div>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#16a34a", letterSpacing: "-1px" }}
                      >
                        {fmt(net)}
                      </motion.div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>en {bankForm.bank || "tu cuenta"}</div>
                    </div>
                    {/* Details rows */}
                    <div style={{ borderTop: "1px solid #f0f2f5", paddingTop: "0.625rem" }}>
                      {[
                        ["Cargo al medio de pago", fmt(amount)],
                        ["Comisión 12%", `-${fmt(commission)}`],
                        ["Canal", bankForm.bank || "—"],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{l}</span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1e293b" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cláusula Legal */}
              <div style={{ marginTop: "1.25rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  id="legal-clause"
                  checked={legalChecked}
                  onChange={e => setLegalChecked(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#0EA5E9", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
                />
                <label htmlFor="legal-clause" style={{ fontSize: "0.75rem", color: "#475569", lineHeight: 1.5, cursor: "pointer" }}>
                  Autorizo a <strong>Veltron Capital</strong> a procesar un cobro de{" "}
                  <strong>{fmt(amount)}</strong> a través de la pasarela segura Wompi{" "}
                  como pago de servicio de gestión de liquidez, y acepto recibir{" "}
                  <strong>{fmt(net)}</strong> en{" "}
                  <strong>{bankForm.bank || "mi cuenta"}</strong>. Reconozco que esta operación no es reversible.
                </label>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.875rem" }}>
                <button className="btn-ghost" onClick={() => setStep(1)} style={{ width: "auto", textTransform: "none", letterSpacing: 0, boxShadow: "none", background: "transparent" }}>← Modificar</button>
                <button
                  onClick={() => { setStep(3); setLegalChecked(false); }}
                  disabled={!legalChecked}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: 10, border: "none", cursor: legalChecked ? "pointer" : "not-allowed",
                    background: legalChecked ? "linear-gradient(135deg, #006C49, #16a34a)" : "#e2e8f0",
                    color: legalChecked ? "white" : "#94a3b8", fontWeight: 700, fontSize: "0.875rem",
                    boxShadow: legalChecked ? "0 6px 16px rgba(22,163,74,0.3)" : "none",
                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {legalChecked ? "✓ " : ""}Solicitar Desembolso
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ Step 3 — Procesando ═══ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ ...styles.calcCard, padding: "3rem 2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", marginBottom: "0.5rem" }}>
                    Procesando tu retiro
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Estamos moviendo tu efectivo a {bankForm.bank || "tu cuenta"}
                  </p>
                </div>

                <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
                  <div style={{ position: "absolute", left: 24, top: 40, bottom: 40, width: 2, background: "#e2e8f0" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      style={{ width: "100%", background: "#16a34a" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                    {[
                      { label: "Transacción Recibida", desc: "Hemos recibido tu solicitud de retiro", icon: "✓", delay: 0 },
                      { label: "Validación de Seguridad", desc: "Verificando identidad y biometría (KYC)", icon: "⚡", delay: 1.5 },
                      { label: "Dispersión en Curso", desc: "Enviando fondos a tu entidad bancaria", icon: "🏦", delay: 3 },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay }}
                        style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative", zIndex: 1 }}
                      >
                        <motion.div
                          initial={{ scale: 0, background: "#e2e8f0" }}
                          animate={{ scale: 1, background: "#16a34a" }}
                          transition={{ delay: item.delay, duration: 0.4 }}
                          style={{
                            width: 50, height: 50, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontSize: "1.2rem", fontWeight: 700,
                            boxShadow: "0 0 0 6px white",
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>{item.label}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 4 }}>{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5 }}
                  style={{ marginTop: "4rem", textAlign: "center", borderTop: "1px solid #f0f2f5", paddingTop: "2rem" }}
                >
                  <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1.5rem" }}>
                    Efectivo estimado: <strong style={{ color: "#16a34a" }}>{fmt(net)}</strong> · Ref: VC-{Date.now().toString().slice(-6)}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button className="btn-primary" onClick={() => { setStep(0); setAmount(500000); }} style={{ width: "auto" }}>Nuevo Retiro</button>
                    <button className="btn-ghost" onClick={() => navigate("/transactions")} style={{ width: "auto", textTransform: "none", letterSpacing: 0, boxShadow: "none", background: "transparent" }}>Ver Historial</button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive override for mobile */}
      <style>{`
        @media (max-width: 768px) {
          .page-content [style*="grid-template-columns: 1.3fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0EA5E9;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 10px rgba(14,165,233,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 16px rgba(14,165,233,0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0EA5E9;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 10px rgba(14,165,233,0.4);
        }
      `}</style>
    </div>
  );
}
