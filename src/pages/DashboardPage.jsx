/**
 * DashboardPage — Veltron Capital
 * Simulador de Retiro + Validador de Cuenta de Destino
 * All emojis replaced with Lucide SVG icons
 */
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Wallet, BarChart3, ShieldCheck, Banknote, CheckCircle,
  CircleDollarSign, ArrowRight, Lock, Lightbulb, HelpCircle,
  Info, Clock, ChevronRight, Calculator, Receipt, Smartphone, Building2,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const withdrawalHistory = [
  { mes: "May", monto: 300000 },
  { mes: "Jun", monto: 500000 },
  { mes: "Jul", monto: 200000 },
  { mes: "Ago", monto: 750000 },
  { mes: "Sep", monto: 450000 },
  { mes: "Oct", monto: 590000 },
];

const recentWithdrawals = [
  { id: "VC-00000008", date: "24 Oct, 2024 · 14:22", gross: 500000, net: 440000, dest: "Nequi · ***890", status: "completed" },
  { id: "VC-00000007", date: "15 Oct, 2024 · 11:30", gross: 300000, net: 264000, dest: "Daviplata · ***214", status: "completed" },
  { id: "VC-00000006", date: "05 Oct, 2024 · 13:10", gross: 150000, net: 132000, dest: "Nequi · ***890", status: "pending" },
];

const DESTINOS = [
  { id: "nequi", label: "Nequi", icon: "nequi", color: "#6B21A8" },
  { id: "daviplata", label: "Daviplata", icon: "daviplata", color: "#EF4444" },
  { id: "banco", label: "Cuenta Bancaria", icon: "bank", color: "#1e3a5f" },
];

const COMISION = 0.12;
const MIN_RETIRO = 100000;
const MAX_RETIRO = 5000000;
const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

function StatusChip({ status }) {
  return status === "completed" ? (
    <span style={{ background: "rgba(0,108,73,0.09)", color: "#006C49", padding: "2px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700 }}>Completado</span>
  ) : (
    <span style={{ background: "rgba(146,64,14,0.09)", color: "#92400e", padding: "2px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700 }}>Pendiente</span>
  );
}

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "0.75rem 1rem", boxShadow: "0 8px 24px rgba(19,27,46,0.12)", fontSize: "0.8rem" }}>
        <div style={{ fontWeight: 700, color: "#131b2e", fontFamily: "Manrope, sans-serif" }}>{fmt(payload[0].value)}</div>
        <div style={{ color: "#3e4850" }}>Retirado</div>
      </div>
    );
  }
  return null;
};

// Shared icon container
const IconBox = ({ children, bg = "rgba(14,165,233,0.08)", size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {children}
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState("");
  const [destino, setDestino] = useState("");
  const [cuentaNum, setCuentaNum] = useState("");
  const inputRef = useRef(null);
  const cuentaVerificada = cuentaNum.length >= 10;

  const montoNum = parseInt(monto.replace(/\D/g, "")) || 0;
  const comision = Math.round(montoNum * COMISION);
  const netoRecibir = montoNum - comision;
  const cobroTarjeta = montoNum;
  const isValid = montoNum >= MIN_RETIRO && montoNum <= MAX_RETIRO;

  const handleMontoChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") { setMonto(""); return; }
    const num = parseInt(raw);
    if (num <= 99999999) setMonto(num.toLocaleString("es-CO").replace(/,/g, "."));
  };

  const quickAmounts = [200000, 500000, 1000000, 2000000];
  const totalRetirado = recentWithdrawals.reduce((a, t) => a + t.gross, 0);
  const totalEnviado = recentWithdrawals.reduce((a, t) => a + t.net, 0);
  const comisionTotal = totalRetirado - totalEnviado;

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">

        {/* ═══ CALCULADORA DE RETIRO — Light Banking Theme ═══ */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 0.65fr",
            gap: "1.25rem",
            alignItems: "start",
          }}>

            {/* ── Tarjeta Izquierda: Calculadora ── */}
            <div style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #f0f2f5",
                fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "1.5px", textTransform: "uppercase", color: "#1e3a5f",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calculator size={12} strokeWidth={2} style={{ color: "#0EA5E9" }} />
                </div>
                Calculadora de Retiro
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem 1.5rem" }}>

                {/* ¿Dónde quieres recibir? */}
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", marginBottom: "0.625rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Wallet size={12} /> ¿Dónde quieres recibir?
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {DESTINOS.map(d => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setDestino(d.id)}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "0.6rem 0.5rem", borderRadius: 12,
                        border: destino === d.id ? `2px solid ${d.color}` : "1.5px solid #e2e8f0",
                        background: destino === d.id ? `${d.color}08` : "white",
                        cursor: "pointer", transition: "all 0.2s",
                        fontSize: "0.75rem", fontWeight: 600, color: destino === d.id ? d.color : "#64748b",
                      }}>
                      {d.icon === "bank"
                        ? <Building2 size={14} />
                        : <Smartphone size={14} />}
                      {d.label}
                    </motion.button>
                  ))}
                </div>

                {/* Input cuenta destino + Validador */}
                {destino && (
                  <div style={{ marginBottom: "0.875rem" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0",
                      padding: "0.5rem 0.875rem",
                    }}>
                      {destino === "nequi" ? <Smartphone size={14} style={{ color: "#6B21A8", flexShrink: 0 }} />
                        : destino === "daviplata" ? <Smartphone size={14} style={{ color: "#EF4444", flexShrink: 0 }} />
                        : <Building2 size={14} style={{ color: "#1e3a5f", flexShrink: 0 }} />}
                      <input
                        type="text" inputMode="numeric" placeholder={destino === "banco" ? "Número de cuenta" : "Número de celular"}
                        value={cuentaNum}
                        onChange={e => setCuentaNum(e.target.value.replace(/\D/g, "").slice(0, 20))}
                        style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", fontFamily: "monospace" }}
                      />
                      {cuentaVerificada && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center" }}>
                          <CheckCircle size={16} style={{ color: "#16a34a" }} />
                        </motion.div>
                      )}
                    </div>
                    {cuentaVerificada && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: "0.68rem", fontWeight: 600, color: "#16a34a", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={10} /> Cuenta verificada para desembolso inmediato
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Pregunta */}
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Banknote size={12} /> ¿Cuánto efectivo necesitas hoy?
                </div>

                {/* Input de monto */}
                <div style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  padding: "1rem 1.25rem 1rem 1.5rem",
                  marginBottom: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#94a3b8", lineHeight: 1 }}>$</span>
                  <input
                    ref={inputRef}
                    type="text" inputMode="numeric" value={monto}
                    onChange={handleMontoChange} placeholder="0"
                    style={{
                      flex: 1, border: "none", background: "transparent",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800,
                      letterSpacing: "-1px", color: "#0f172a",
                      outline: "none", width: "100%",
                    }}
                  />
                </div>

                {/* Slider de monto — Windral Style */}
                <style>{`
                  .windral-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 5px;
                    border-radius: 99px;
                    outline: none;
                    cursor: pointer;
                  }
                  .windral-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 38% 35%, #7dd3fc 0%, #0EA5E9 50%, #0284c7 100%);
                    border: 3px solid #ffffff;
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.32), 0 2px 10px rgba(14,165,233,0.45);
                    cursor: pointer;
                    transition: box-shadow 0.2s ease, transform 0.15s ease;
                  }
                  .windral-slider::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 5px rgba(14,165,233,0.25), 0 4px 14px rgba(14,165,233,0.55);
                    transform: scale(1.12);
                  }
                  .windral-slider::-webkit-slider-thumb:active {
                    box-shadow: 0 0 0 7px rgba(14,165,233,0.18), 0 4px 18px rgba(14,165,233,0.65);
                    transform: scale(1.18);
                  }
                  .windral-slider::-moz-range-thumb {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 38% 35%, #7dd3fc 0%, #0EA5E9 50%, #0284c7 100%);
                    border: 3px solid #ffffff;
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.32), 0 2px 10px rgba(14,165,233,0.45);
                    cursor: pointer;
                  }
                  .windral-slider::-moz-range-track {
                    height: 5px;
                    border-radius: 99px;
                    background: #e2e8f0;
                  }
                  .windral-slider::-moz-range-progress {
                    height: 5px;
                    border-radius: 99px;
                    background: #11192e;
                  }
                `}</style>
                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="range"
                    className="windral-slider"
                    min={MIN_RETIRO}
                    max={MAX_RETIRO}
                    step={50000}
                    value={montoNum || MIN_RETIRO}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMonto(v.toLocaleString("es-CO").replace(/,/g, "."));
                    }}
                    style={{
                      background: `linear-gradient(90deg, #11192e ${(((montoNum || MIN_RETIRO) - MIN_RETIRO) / (MAX_RETIRO - MIN_RETIRO)) * 100}%, #e2e8f0 ${(((montoNum || MIN_RETIRO) - MIN_RETIRO) / (MAX_RETIRO - MIN_RETIRO)) * 100}%)`,
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>$ 100.000</span>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>$ 5.000.000</span>
                  </div>
                </div>

                {/* Progreso mensual */}
                {(() => {
                  const metaMensual = totalRetirado > 0 ? Math.max(totalRetirado * 2, 2000000) : 2000000;
                  const progPct = Math.min((totalRetirado / metaMensual) * 100, 100);
                  return (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748b" }}>Retirado este mes</span>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#0f172a" }}>
                          {fmt(totalRetirado)} <span style={{ fontWeight: 400, color: "#94a3b8" }}>/ {fmt(metaMensual)}</span>
                        </span>
                      </div>
                      <div style={{ height: 5, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99, transition: "width 0.6s ease",
                          width: `${progPct}%`,
                          background: progPct > 80
                            ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                            : "linear-gradient(90deg, #006591, #0EA5E9)",
                        }} />
                      </div>
                    </div>
                  );
                })()}

                {/* Botones rápidos */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {quickAmounts.map(amt => (
                    <motion.button
                      key={amt}
                      whileHover={{ scale: 1.03, opacity: 1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMonto(amt.toLocaleString("es-CO").replace(/,/g, "."))}
                      style={{
                        padding: "0.45rem 1rem", borderRadius: 99,
                        border: montoNum === amt
                          ? "2px solid #0EA5E9"
                          : "2px solid #1e3a5f",
                        background: montoNum === amt ? "#0F172A" : "#1e3a5f",
                        color: "white",
                        fontSize: "0.75rem", fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s ease",
                        boxShadow: montoNum === amt ? "0 0 0 3px rgba(14,165,233,0.2)" : "none",
                        opacity: montoNum === amt ? 1 : 0.7,
                      }}>
                      {fmt(amt)}
                    </motion.button>
                  ))}
                </div>

                {/* Validaciones */}
                {montoNum > 0 && montoNum < MIN_RETIRO && (
                  <div style={{ fontSize: "0.72rem", color: "#f59e0b", marginBottom: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <Info size={13} /> Monto mínimo: {fmt(MIN_RETIRO)}
                  </div>
                )}
                {montoNum > MAX_RETIRO && (
                  <div style={{ fontSize: "0.72rem", color: "#ef4444", marginBottom: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <Info size={13} /> Monto máximo por operación: {fmt(MAX_RETIRO)}
                  </div>
                )}

                {/* Botón CTA */}
                <motion.div whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(15,23,42,0.4)" }} whileTap={{ y: 0 }} style={{ borderRadius: 12 }}>
                  <Link
                    to="/withdrawal"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "0.9rem 1.25rem", borderRadius: 12,
                      background: isValid
                        ? "linear-gradient(135deg, #0F172A 0%, #006591 55%, #0EA5E9 100%)"
                        : "#f1f5f9",
                      color: isValid ? "white" : "#94a3b8",
                      fontWeight: 700, fontSize: "0.875rem", textDecoration: "none",
                      pointerEvents: isValid ? "auto" : "none",
                      transition: "all 0.2s",
                      boxShadow: isValid
                        ? "0 8px 24px rgba(15,23,42,0.3)"
                        : "none",
                      letterSpacing: "0.2px",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                    <ArrowRight size={15} />
                    {montoNum > 0 && isValid
                      ? `Procesar Pago de Servicio — ${fmt(netoRecibir)}`
                      : "Procesar Pago de Servicio →"}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* ── Tarjeta Derecha: Resumen ── */}
            <div style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #f0f2f5",
                fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "1.5px", textTransform: "uppercase", color: "#1e3a5f",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Receipt size={12} strokeWidth={2} style={{ color: "#0EA5E9" }} />
                </div>
                Resumen de la Operación
              </div>

              {/* Body */}
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <AnimatePresence mode="wait">
                  {montoNum > 0 ? (
                    <motion.div
                      key="resumen-activo"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {/* Subtotal */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>Subtotal</span>
                        <motion.span key={"s-" + montoNum} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                          style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b" }}>
                          {fmt(montoNum)}
                        </motion.span>
                      </div>

                      {/* Gestión */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>Gestión Veltron (12%)</span>
                        <motion.span key={"c-" + comision} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                          style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ef4444" }}>
                          -{fmt(comision)}
                        </motion.span>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: "#f0f2f5", margin: "0.875rem 0" }} />

                      {/* Total */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>Total a Recibir</span>
                        <motion.span
                          key={"n-" + netoRecibir}
                          initial={{ scale: 0.92, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
                          {fmt(netoRecibir)}
                        </motion.span>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: "#f0f2f5", margin: "1rem 0" }} />

                      {/* Info bullets */}
                      {[
                        destino ? `Destino: ${DESTINOS.find(d => d.id === destino)?.label || "Sin seleccionar"}` : "Selecciona dónde recibir",
                        "Procesamiento en menos de 15 minutos",
                        "Pago procesado por pasarela Wompi",
                      ].map((txt) => (
                        <div key={txt} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.73rem", color: "#64748b", fontWeight: 500, marginBottom: "0.375rem" }}>
                          <CheckCircle size={13} style={{ color: "#16a34a", flexShrink: 0 }} />
                          {txt}
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="resumen-vacio"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.07, 1], opacity: [0.25, 0.45, 0.25] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        style={{ marginBottom: "0.875rem" }}>
                        <Receipt size={32} style={{ margin: "0 auto", color: "#cbd5e1" }} />
                      </motion.div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.375rem" }}>Tu ticket aparecerá aquí</div>
                      <div style={{ fontSize: "0.72rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                        Escribe el monto o selecciona uno rápido para ver el desglose al instante.
                      </div>
                      <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[["Subtotal", "—"], ["Gestión (12%)", "—"], ["Total a Recibir", "—"]].map(([label, val]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.35rem 0", borderBottom: "1px solid #f1f5f9" }}>
                            <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>{label}</span>
                            <span style={{ fontSize: "0.75rem", color: "#e2e8f0", fontFamily: "monospace" }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security badge */}
              <div style={{ padding: "0 1.25rem 1.25rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "0.75rem 1rem", borderRadius: 10,
                  background: "rgba(22,163,74,0.05)",
                  border: "1px solid rgba(22,163,74,0.1)",
                }}>
                  <Lock size={12} style={{ color: "#16a34a", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.7rem", color: "#16a34a", fontWeight: 600 }}>
                    Transacción protegida AES-256
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive override */}
          <style>{`
            @media (max-width: 768px) {
              .dash-calc-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </motion.div>


        {/* ═══ KPI CARDS ═══ */}
        <motion.div variants={fadeUp} className="grid-3" style={{ marginBottom: "var(--spacing-6)" }}>
          {[
            { label: "Total Retirado (mes)", value: fmt(totalRetirado), sub: "3 operaciones este mes", icon: <CircleDollarSign size={18} strokeWidth={1.8} style={{ color: "#0EA5E9" }} />, iconBg: "rgba(14,165,233,0.08)" },
            { label: "Recibido en Cuenta", value: fmt(totalEnviado), sub: "Neto después de comisión", icon: <CheckCircle size={18} strokeWidth={1.8} style={{ color: "#006C49" }} />, iconBg: "rgba(0,108,73,0.08)" },
            { label: "Costo del servicio (12%)", value: fmt(comisionTotal), sub: "Total gestión de red", icon: <BarChart3 size={18} strokeWidth={1.8} style={{ color: "#6e7881" }} />, iconBg: "rgba(110,120,129,0.08)" },
          ].map(({ label, value, sub, icon, iconBg }) => (
            <div key={label} className="metric-card">
              <div className="metric-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="metric-label">{label}</span>
                <IconBox bg={iconBg}>{icon}</IconBox>
              </div>
              <div className="metric-card-body">
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px" }}>{value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ═══ CHART + INFO ═══ */}
        <div className="grid-2-1" style={{ marginBottom: "var(--spacing-6)" }}>
          <motion.div variants={fadeUp} className="card">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="metric-label">Retiros por Mes</div>
                <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Monto bruto solicitado por período</div>
              </div>
              <span className="chip chip-primary">Últimos 6 meses</span>
            </div>
            <div style={{ height: 200, marginTop: "1rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={withdrawalHistory} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="rgba(190,200,210,0.15)" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6e7881" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(14,165,233,0.05)" }} />
                  <Bar dataKey="monto" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            {/* KYC Status */}
            <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <IconBox bg="rgba(0,108,73,0.08)" size={44}><ShieldCheck size={22} strokeWidth={1.8} style={{ color: "#006C49" }} /></IconBox>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>KYC Verificado</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>Identidad confirmada · Acceso completo</div>
                </div>
                <span className="chip chip-tertiary" style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={12} /> Activo</span>
              </div>
            </div>

            {/* How it works */}
            <div className="card" style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--on-surface)", marginBottom: "1rem" }}>¿Cómo funciona?</div>
              {[
                { n: "1", label: "Escribes el monto", desc: "Dices cuánto efectivo necesitas" },
                { n: "2", label: "Pagas vía checkout Wompi", desc: "Se procesa como pago de servicio único" },
                { n: "3", label: "Recibes el efectivo", desc: "Neto enviado a tu Nequi / Daviplata" },
              ].map(({ n, label, desc }) => (
                <div key={n} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.875rem", alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #006591, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--on-surface)" }}>{label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ RECENT WITHDRAWALS ═══ */}
        <motion.div variants={fadeUp} className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Últimos Retiros</div>
              <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Conversiones de cupo → efectivo recientes</div>
            </div>
            <Link to="/transactions" className="btn-ghost btn-sm" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>Ver todo <ChevronRight size={14} /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 100px", gap: "1rem", padding: "0.5rem 1.25rem", borderBottom: "1px solid rgba(190,200,210,0.15)" }}>
            {["Fecha / ID", "Monto", "Comisión", "Recibiste", "Estado"].map(h => (
              <div key={h} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>{h}</div>
            ))}
          </div>
          {recentWithdrawals.map((tx) => (
            <Link key={tx.id} to={`/transactions/${tx.id}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 100px", gap: "1rem", padding: "1rem 1.25rem", borderRadius: 12, transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-container-low)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)" }}>{tx.dest}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)", marginTop: 2 }}>{tx.date} · {tx.id}</div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--on-surface)", fontSize: "0.875rem", display: "flex", alignItems: "center" }}>{fmt(tx.gross)}</div>
                <div style={{ fontWeight: 600, color: "var(--error)", fontSize: "0.875rem", display: "flex", alignItems: "center" }}>-{fmt(tx.gross - tx.net)}</div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, color: "#006C49", fontSize: "0.9rem", display: "flex", alignItems: "center" }}>{fmt(tx.net)}</div>
                <div style={{ display: "flex", alignItems: "center" }}><StatusChip status={tx.status} /></div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* ═══ COMMISSION EXPLAINER ═══ */}
        <motion.div variants={fadeUp} style={{ marginTop: "var(--spacing-6)" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.75rem", background: "rgba(14,165,233,0.05)",
            borderRadius: 18, flexWrap: "wrap", gap: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <IconBox bg="rgba(14,165,233,0.1)" size={40}><Lightbulb size={20} strokeWidth={1.8} style={{ color: "#0EA5E9" }} /></IconBox>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--on-surface)" }}>
                  Comisión transparente del 12% — Sin costos ocultos
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>
                  Solicitas $1.000.000 → Cobramos $1.000.000 a tu tarjeta → Recibes $880.000 en tu cuenta
                </div>
              </div>
            </div>
            <Link to="/help" className="btn-outline btn-sm" style={{ textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
              <HelpCircle size={14} /> Ver FAQ
            </Link>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}
