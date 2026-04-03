import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

// Mock data — in a real app this would come from an API
const MOCK_TRANSACTIONS = {
  "VC-00000008": { id: "VC-00000008", gross: 500000, commission: 60000, net: 440000, dest: "Nequi · 316 XXX X890", holder: "Andrés Castillo", date: "Oct 24, 2024", time: "14:22", status: "completed", bank: "Nequi" },
  "VC-00000007": { id: "VC-00000007", gross: 300000, commission: 36000, net: 264000, dest: "Daviplata · 310 XXX X214", holder: "Andrés Castillo", date: "Oct 15, 2024", time: "11:30", status: "completed", bank: "Daviplata" },
  "VC-00000006": { id: "VC-00000006", gross: 150000, commission: 18000, net: 132000, dest: "Nequi · 316 XXX X890", holder: "Andrés Castillo", date: "Oct 05, 2024", time: "13:10", status: "pending", bank: "Nequi" },
};

const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

const TIMELINE = [
  { label: "Solicitud recibida", sub: "El sistema registró tu solicitud" },
  { label: "Pago recibido vía Wompi", sub: "Transacción validada en pasarela segura" },
  { label: "Fondos verificados", sub: "Cargo de servicio de liquidez aplicado" },
  { label: "Transferencia enviada", sub: "Efectivo enviado a tu cuenta destino" },
];

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Generate times for timeline
  const tx = MOCK_TRANSACTIONS[id] || Object.values(MOCK_TRANSACTIONS)[0];
  const [baseH, baseM] = tx.time.split(":").map(Number);
  const times = TIMELINE.map((_, i) => {
    const m = baseM + i;
    const h = baseH + Math.floor(m / 60);
    return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  });

  return (
    <div className="page-content">
      {/* Back Nav */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "1.5rem", padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver al Historial
      </button>

      <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Status Hero */}
        <motion.div variants={fadeUp} style={{ marginBottom: "var(--spacing-6)" }}>
          <div style={{
            background: tx.status === "completed"
              ? "linear-gradient(135deg, #006C49, #00B17B)"
              : "linear-gradient(135deg, #92400e, #d97706)",
            borderRadius: 24, padding: "2.5rem",
            color: "white", textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: tx.status === "completed" ? "0 16px 48px rgba(0,177,123,0.3)" : "0 16px 48px rgba(146,64,14,0.3)",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem",
                fontSize: "1.75rem",
              }}
            >
              {tx.status === "completed" ? "✓" : "⏳"}
            </motion.div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.75, marginBottom: "0.5rem" }}>
              {tx.status === "completed" ? "Retiro Completado" : "En Procesamiento"}
            </div>
            <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "2.75rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: "0.5rem" }}>
              {fmt(tx.net)}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>enviados a {tx.dest} · {tx.date}, {tx.time}</div>
          </div>
        </motion.div>

        {/* Process Timeline */}
        <motion.div variants={fadeUp} className="card" style={{ marginBottom: "var(--spacing-6)" }}>
          <div className="card-header">
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Proceso de Conversión</div>
            <div style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)", marginTop: 2 }}>Seguimiento del ciclo de vida del retiro</div>
          </div>
          <div style={{ position: "relative", paddingLeft: "2rem" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: "0.9rem", top: 8, bottom: 8, width: 2, background: "var(--surface-container-high)", borderRadius: 1 }}>
              <div style={{ height: tx.status === "completed" ? "100%" : "60%", background: "linear-gradient(180deg, #006C49, #00B17B)", borderRadius: 1, transition: "height 0.8s ease" }} />
            </div>

            {TIMELINE.map((step, i) => {
              const done = tx.status === "completed" || i < 2;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: i < TIMELINE.length - 1 ? "1.25rem" : 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: done ? "#006C49" : "var(--surface-container-high)",
                    color: done ? "white" : "var(--on-surface-variant)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 800,
                    position: "relative", zIndex: 1,
                    marginLeft: "-2.45rem",
                    boxShadow: done ? "0 0 0 4px rgba(0,108,73,0.15)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: done ? "var(--on-surface)" : "var(--on-surface-variant)" }}>{step.label}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--outline)", fontFamily: "monospace" }}>{times[i]}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: 2 }}>{step.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Detail Breakdown */}
        <motion.div variants={fadeUp} className="card" style={{ marginBottom: "var(--spacing-6)" }}>
          <div className="card-header">
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--on-surface)" }}>Desglose de la Operación</div>
          </div>
          {[
            ["Monto solicitado", fmt(tx.gross), "neutral"],
            ["Comisión Veltron (12%)", `-${fmt(tx.commission)}`, "negative"],
            ["Monto enviado", fmt(tx.net), "positive"],
            [null, null, "divider"],
            ["Destino", tx.dest, "neutral"],
            ["Titular", tx.holder, "neutral"],
            ["Medio de pago", "Checkout Wompi", "neutral"],
            ["Banco enviado", tx.bank, "neutral"],
            ["ID de operación", tx.id, "mono"],
          ].map(([label, val, type], i) => {
            if (type === "divider") return <div key={i} style={{ height: 1, background: "rgba(190,200,210,0.2)", margin: "0.75rem 0" }} />;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0", borderBottom: i < 7 ? "1px solid rgba(190,200,210,0.1)" : "none" }}>
                <span style={{ fontSize: "0.825rem", color: "var(--on-surface-variant)" }}>{label}</span>
                <span style={{
                  fontSize: type === "positive" ? "1.1rem" : "0.875rem",
                  fontWeight: type === "positive" ? 800 : 600,
                  fontFamily: type === "positive" || type === "mono" ? "Manrope, sans-serif" : "inherit",
                  color: type === "positive" ? "#006C49" : type === "negative" ? "var(--error)" : type === "mono" ? "var(--primary)" : "var(--on-surface)",
                }}>{val}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeUp} style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => alert("Descargando comprobante PDF...")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Descargar Comprobante
          </button>
          <Link to="/help" className="btn-ghost" style={{ textDecoration: "none" }}>
            Reportar un problema
          </Link>
          <Link to="/withdrawal" className="btn-outline" style={{ textDecoration: "none" }}>
            ⚡ Nuevo Retiro
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
