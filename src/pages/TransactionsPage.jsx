import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CircleDollarSign, CheckCircle, BarChart3, Search, Download,
  Wallet, Landmark, Clock, ArrowDownRight,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };

const TRANSACTIONS = [
  { id: "VC-00000009", dest: "Nequi · ***882", date: "Hoy", time: "06:58", gross: 800000, net: 704000, comision: 96000, status: "pending", method: "Nequi" },
  { id: "VC-00000008", dest: "Nequi · ***890", date: "24 Oct, 2024", time: "14:22", gross: 500000, net: 440000, comision: 60000, status: "completed", method: "Nequi" },
  { id: "VC-00000007", dest: "Daviplata · ***214", date: "15 Oct, 2024", time: "11:30", gross: 300000, net: 264000, comision: 36000, status: "completed", method: "Daviplata" },
  { id: "VC-00000006", dest: "Nequi · ***890", date: "05 Oct, 2024", time: "13:10", gross: 150000, net: 132000, comision: 18000, status: "completed", method: "Nequi" },
  { id: "VC-00000005", dest: "Bancolombia · ***345", date: "28 Sep, 2024", time: "16:42", gross: 1000000, net: 880000, comision: 120000, status: "completed", method: "Transferencia" },
  { id: "VC-00000004", dest: "Nequi · ***890", date: "18 Sep, 2024", time: "09:15", gross: 200000, net: 176000, comision: 24000, status: "completed", method: "Nequi" },
  { id: "VC-00000003", dest: "Daviplata · ***214", date: "10 Sep, 2024", time: "12:30", gross: 750000, net: 660000, comision: 90000, status: "completed", method: "Daviplata" },
  { id: "VC-00000002", dest: "Nequi · ***890", date: "25 Ago, 2024", time: "15:00", gross: 400000, net: 352000, comision: 48000, status: "completed", method: "Nequi" },
  { id: "VC-00000001", dest: "Bancolombia · ***345", date: "12 Ago, 2024", time: "10:20", gross: 600000, net: 528000, comision: 72000, status: "completed", method: "Transferencia" },
];

const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-CO").replace(/,/g, ".");

function StatusChip({ status }) {
  const cfg = {
    completed: { label: "Completado", bg: "rgba(0,108,73,0.08)", color: "#006C49" },
    pending: { label: "Pendiente", bg: "rgba(146,64,14,0.08)", color: "#92400e" },
  }[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function MethodIcon({ method }) {
  const icons = {
    "Nequi": <Wallet size={18} strokeWidth={1.8} style={{ color: "#6B21A8" }} />,
    "Daviplata": <Wallet size={18} strokeWidth={1.8} style={{ color: "#D97706" }} />,
    "Transferencia": <Landmark size={18} strokeWidth={1.8} style={{ color: "#006591" }} />,
  };
  return (
    <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icons[method] || <ArrowDownRight size={18} style={{ color: "#006591" }} />}
    </div>
  );
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = TRANSACTIONS.filter(tx => {
    const matchTab = activeTab === "all" || tx.method === activeTab;
    const matchSearch = tx.dest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalGross = TRANSACTIONS.reduce((a, t) => a + t.gross, 0);
  const totalNet = TRANSACTIONS.reduce((a, t) => a + t.net, 0);
  const totalComision = TRANSACTIONS.reduce((a, t) => a + t.comision, 0);

  return (
    <div className="page-content">
      <motion.div variants={stagger} initial="hidden" animate="visible">
        {/* Summary Cards */}
        <motion.div variants={fadeUp} className="grid-3" style={{ marginBottom: "var(--spacing-6)" }}>
          {[
            { label: "Total Solicitado", value: fmt(totalGross), sub: `${TRANSACTIONS.length} operaciones`, icon: <CircleDollarSign size={18} strokeWidth={1.8} style={{ color: "#0EA5E9" }} />, iconBg: "rgba(14,165,233,0.08)" },
            { label: "Recibido en Cuenta", value: fmt(totalNet), sub: "Neto después de comisión", icon: <CheckCircle size={18} strokeWidth={1.8} style={{ color: "#006C49" }} />, iconBg: "rgba(0,108,73,0.08)" },
            { label: "Costo del Servicio (12%)", value: fmt(totalComision), sub: "Costo acumulado del servicio", icon: <BarChart3 size={18} strokeWidth={1.8} style={{ color: "#6e7881" }} />, iconBg: "rgba(110,120,129,0.08)" },
          ].map(({ label, value, sub, icon, iconBg }) => (
            <div key={label} className="metric-card">
              <div className="metric-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="metric-label">{label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
              </div>
              <div className="metric-card-body">
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-1px" }}>{value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.25rem" }}>{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters + Table */}
        <motion.div variants={fadeUp} className="card">
          <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--on-surface)" }}>
                Historial de Retiros
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)", marginTop: 2 }}>
                Registro completo de tus conversiones de cupo a efectivo
              </div>
            </div>
            <button className="btn-outline btn-sm" onClick={() => alert("Exportando CSV con " + TRANSACTIONS.length + " operaciones...")}
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> Exportar CSV
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div className="tabs">
              {[["all","Todos"], ["Nequi","Nequi"], ["Daviplata","Daviplata"], ["Transferencia","Transferencia"]].map(([key, label]) => (
                <button key={key} className={`tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
              <div style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--outline)" }}>
                <Search size={15} />
              </div>
              <input className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="Buscar por destino, fecha o ID…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 110px 110px 110px 90px", gap: "1rem", padding: "0.5rem 1.25rem", borderBottom: "1px solid rgba(190,200,210,0.15)" }}>
            {["", "Destino / Fecha", "Monto", "Comisión", "Recibiste", "Estado"].map(h => (
              <div key={h || "icon"} style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>{h}</div>
            ))}
          </div>

          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
                No se encontraron operaciones.
              </div>
            ) : filtered.map((tx) => (
              <Link key={tx.id} to={`/transactions/${tx.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 110px 110px 110px 90px", gap: "1rem", padding: "0.875rem 1.25rem", borderRadius: 12, transition: "background 0.15s", cursor: "pointer", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-container-low)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <MethodIcon method={tx.method} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)" }}>{tx.dest}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)", marginTop: 2 }}>
                      {tx.date} · {tx.time} · {tx.id} · Pago vía Wompi
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--on-surface)", fontSize: "0.875rem" }}>{fmt(tx.gross)}</div>
                  <div style={{ fontWeight: 600, color: "var(--error)", fontSize: "0.825rem" }}>-{fmt(tx.comision)}</div>
                  <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, color: "#006C49", fontSize: "0.9rem" }}>{fmt(tx.net)}</div>
                  <div><StatusChip status={tx.status} /></div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "1rem", borderTop: "1px solid rgba(190,200,210,0.1)", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--on-surface-variant)" }}>
              Mostrando {filtered.length} de {TRANSACTIONS.length} operaciones
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
