import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus, createProduct, getRequests, updateRequestStatus, getContactMessages, markMessageAsRead, deleteContactMessage, getAuditLogs, getPaymentAlerts, calculateRevenueStats } from '../services/api';
import { exportOrdersToCSV } from '../utils/csvExporter';
import ReceiptPreviewModal from '../common/ReceiptPreviewModal';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Plus, ExternalLink, RefreshCw, FileText, MessageSquare, Mail, Bell, Trash2, Eye, ShieldAlert, Activity, DollarSign, TrendingUp, Download, BarChart3, PieChart } from 'lucide-react';
import { useFileLoading } from '../context/FileLoadingContext';

export default function AdminPage() {
  const { startLoading, updateProgress, setSuccess, setError: setFileError } = useFileLoading();
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ordenes');
  const [revenueRange, setRevenueRange] = useState('all'); // '7d', 'month', 'all'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Formulario nuevo producto
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('libro');
  const [descripcion, setDescripcion] = useState('');
  const [semanaInicio, setSemanaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [semanaFin, setSemanaFin] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [creatingProd, setCreatingProd] = useState(false);
  const [prodSuccess, setProdSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordData, reqData, msgData, logsData, alertsData] = await Promise.all([
        getAdminOrders(),
        getRequests(),
        getContactMessages(),
        getAuditLogs(),
        getPaymentAlerts()
      ]);
      setOrders(ordData);
      setRequests(reqData);
      setMessages(msgData || []);
      setAuditLogs(logsData || []);
      setAlerts(alertsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const unreadMessagesCount = messages.filter((m) => !m.leido).length;

  const handleApprove = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'aprobado');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'rechazado');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    setCreatingProd(true);

    if (file) {
      startLoading({
        operation: 'upload',
        fileName: file.name,
        initialProgress: 25,
      });
    }

    try {
      if (file) updateProgress(65);
      await createProduct(
        { titulo, tipo, descripcion, semana_inicio: semanaInicio, semana_fin: semanaFin },
        file,
        null
      );

      if (file) {
        updateProgress(100);
        setSuccess('Producto digital subido y registrado con éxito.');
      }

      setTitulo('');
      setDescripcion('');
      setFile(null);
      setProdSuccess(true);
      setTimeout(() => setProdSuccess(false), 4000);
      loadData();
    } catch (err) {
      console.error(err);
      if (file) setFileError(err.message || 'Error al subir el producto digital.');
    } finally {
      setCreatingProd(false);
    }
  };

  const handleUpdateRequestStatus = async (reqId, estado) => {
    try {
      await updateRequestStatus(reqId, estado);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (msgId) => {
    try {
      await markMessageAsRead(msgId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteContactMessage(msgId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2C2C] text-[#FFD53D] text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Panel Administrativo
          </div>
          <h1 className="text-2xl font-black text-[#2C2C2C]">Gestión y Verificación Veltron</h1>
        </div>

        <div className="flex items-center gap-3">
          {unreadMessagesCount > 0 && (
            <button
              onClick={() => setActiveTab('mensajes')}
              className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-rose-100 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
              <span>{unreadMessagesCount} {unreadMessagesCount === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}</span>
            </button>
          )}
          <button
            onClick={loadData}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#2C2C2C] flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
          </button>
        </div>
      </div>

      {/* Tabs de Navegación Admin */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 flex-wrap">
        <button
          onClick={() => setActiveTab('ingresos')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ingresos'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Ingresos & Ventas</span>
        </button>
        <button
          onClick={() => setActiveTab('ordenes')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'ordenes'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          Órdenes Pendientes ({orders.filter(o => o.estado === 'pendiente').length})
        </button>
        <button
          onClick={() => setActiveTab('nuevo-producto')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'nuevo-producto'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          Subir Producto Semanal
        </button>
        <button
          onClick={() => setActiveTab('solicitude-admin')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'solicitude-admin'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          Gestionar Solicitudes ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('mensajes')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'mensajes'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Mensajes Recibidos</span>
          {unreadMessagesCount > 0 ? (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {unreadMessagesCount}
            </span>
          ) : (
            <span className="text-slate-400">({messages.length})</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'auditoria'
              ? 'text-[#1E3A8A] border-[#1E3A8A]'
              : 'text-slate-500 border-transparent hover:text-[#2C2C2C]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Auditoría & Excepciones</span>
          {alerts.filter(a => !a.resuelto).length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {alerts.filter(a => !a.resuelto).length} Alertas
            </span>
          )}
        </button>
      </div>

      {/* TAB 0: INGRESOS Y REPORTES FINANCIEROS */}
      {activeTab === 'ingresos' && (() => {
        const filteredForRevenue = orders.filter((o) => {
          if (!o.created_at) return true;
          const time = new Date(o.created_at).getTime();
          const now = Date.now();
          if (revenueRange === '7d') return (now - time) <= 7 * 86400000;
          if (revenueRange === 'month') return (now - time) <= 30 * 86400000;
          return true;
        });

        const stats = calculateRevenueStats(filteredForRevenue);
        const maxDaily = Math.max(...stats.dailyTrend.map(d => d.total), 1);

        return (
          <div className="space-y-6">
            {/* Header de Filtros y Botón de Exportación CSV */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Período:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setRevenueRange('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${revenueRange === 'all' ? 'bg-[#1E3A8A] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'}`}
                  >
                    Todo el Historial
                  </button>
                  <button
                    onClick={() => setRevenueRange('month')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${revenueRange === 'month' ? 'bg-[#1E3A8A] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'}`}
                  >
                    Este Mes
                  </button>
                  <button
                    onClick={() => setRevenueRange('7d')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${revenueRange === '7d' ? 'bg-[#1E3A8A] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'}`}
                  >
                    Últimos 7 Días
                  </button>
                </div>
              </div>

              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Exportar Reporte Contable (.CSV)
              </button>
            </div>

            {/* 3 Tarjetas KPI Principales con Jerarquía Perfecta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Tarjeta 1: Ingresos Totales */}
              <div className="glass-card bg-gradient-to-br from-blue-900 via-[#1E3A8A] to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-blue-800/40 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-xs font-black uppercase tracking-wider">Ingresos Totales (COP)</span>
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-[#FFD53D] flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ${stats.totalRevenue.toLocaleString('es-CO')} <span className="text-xs font-normal text-blue-200">COP</span>
                  </div>
                  <p className="text-[11px] text-blue-200/90 font-medium mt-1">Recaudación neta acumulada de órdenes aprobadas.</p>
                </div>
              </div>

              {/* Tarjeta 2: Órdenes Aprobadas */}
              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Órdenes Aprobadas</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
                    {stats.totalApproved} <span className="text-xs font-bold text-slate-400">ventas</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Transacciones confirmadas y entregadas.</p>
                </div>
              </div>

              {/* Tarjeta 3: Ticket Promedio por Aporte */}
              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Ticket Promedio por Aporte</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight">
                    ${stats.avgTicket.toLocaleString('es-CO')} <span className="text-xs font-bold text-slate-400">COP</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Promedio de valor de compra voluntaria por cliente.</p>
                </div>
              </div>
            </div>

            {/* Gráfica Ambiental de Tendencia Diaria con Línea Base y Tooltip Elegante */}
            <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#2C2C2C]">Tendencia Diaria de Ventas</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Ingresos agrupados por día</span>
              </div>

              {stats.dailyTrend.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium text-center py-10">No hay datos de ingresos registrados en el período seleccionado.</p>
              ) : (
                <div className="pt-2">
                  <div className="h-44 flex items-end justify-between gap-2.5 pb-2 border-b border-slate-200/60">
                    {stats.dailyTrend.map((item, idx) => {
                      const heightPercent = Math.max((item.total / maxDaily) * 100, 14);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end relative">
                          {/* Tooltip flotante */}
                          <div className="absolute -top-7 text-[10px] font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 transform group-hover:-translate-y-1 shadow-xs pointer-events-none whitespace-nowrap z-10">
                            ${item.total.toLocaleString('es-CO')}
                          </div>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-[#1E3A8A] to-blue-500 group-hover:from-[#1E3A8A] group-hover:to-emerald-500 rounded-t-lg transition-all duration-200 shadow-2xs"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-400 truncate max-w-[48px] text-center pt-1">
                            {item.date.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Grid 2 Columnas Perfectamente Alineado: Desglose por Método de Pago & Ranking de Productos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Desglose Métodos de Pago */}
              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <PieChart className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-[#2C2C2C]">Canales y Métodos de Pago</h3>
                  </div>
                </div>

                <div className="space-y-4 my-auto">
                  {/* Wompi Item */}
                  <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-[#2C2C2C]">Wompi Pasarela Segura</div>
                        <div className="text-[10px] text-slate-400 font-bold">Tarjetas de Crédito, PSE, Nequi</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-[#1E3A8A]">${(stats.methodMap.wompi || 0).toLocaleString('es-CO')} COP</div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {stats.totalRevenue > 0 ? Math.round(((stats.methodMap.wompi || 0) / stats.totalRevenue) * 100) : 0}% del total
                        </div>
                      </div>
                    </div>
                    {/* Barra visual de progreso */}
                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E3A8A] h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.totalRevenue > 0 ? Math.round(((stats.methodMap.wompi || 0) / stats.totalRevenue) * 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Llave Bancolombia Item */}
                  <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-[#2C2C2C]">Llave Bancolombia / Bre-B</div>
                        <div className="text-[10px] text-slate-400 font-bold">Transferencia cuenta a cuenta ($0 costo)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-700">${(stats.methodMap['bre-b'] || 0).toLocaleString('es-CO')} COP</div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {stats.totalRevenue > 0 ? Math.round(((stats.methodMap['bre-b'] || 0) / stats.totalRevenue) * 100) : 0}% del total
                        </div>
                      </div>
                    </div>
                    {/* Barra visual de progreso */}
                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${stats.totalRevenue > 0 ? Math.round(((stats.methodMap['bre-b'] || 0) / stats.totalRevenue) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ranking Productos Más Vendidos */}
              <div className="glass-card bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-[#2C2C2C]">Productos Más Vendidos</h3>
                  </div>
                </div>

                {stats.productRanking.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium py-10 text-center my-auto">Sin datos de ventas de productos en este período.</p>
                ) : (
                  <div className="space-y-3 my-auto">
                    {stats.productRanking.slice(0, 4).map((prod, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1E3A8A] font-black text-[11px] flex items-center justify-center shrink-0 border border-blue-100">
                            #{idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#2C2C2C] truncate">{prod.titulo}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{prod.ventas} {prod.ventas === 1 ? 'unidad vendida' : 'unidades vendidas'}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-black text-[#1E3A8A] shrink-0">
                          ${prod.total.toLocaleString('es-CO')} COP
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 1: ÓRDENES Y VERIFICACIÓN EN 1 CLIC */}
      {activeTab === 'ordenes' && (
        <div className="space-y-4">
          <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200/80 overflow-x-auto shadow-xs">
            {loading ? (
              <p className="text-xs text-slate-500 font-medium">Cargando órdenes...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium text-center py-6">No hay órdenes pendientes en este momento.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">Referencia</th>
                    <th className="pb-3 px-2">Nombre Pagador</th>
                    <th className="pb-3 px-2">Correo / Teléfono</th>
                    <th className="pb-3 px-2">Producto</th>
                    <th className="pb-3 px-2">Recibo</th>
                    <th className="pb-3 px-2">Estado</th>
                    <th className="pb-3 px-2 text-right">Acción 1-Clic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-2 font-mono font-black text-[#1E3A8A]">{ord.referencia_pago}</td>
                      <td className="py-4 px-2 font-bold text-[#2C2C2C]">{ord.nombre_comprador || 'Comprador'}</td>
                      <td className="py-4 px-2 text-slate-600">
                        <div className="font-bold">{ord.email_comprador}</div>
                        <div className="text-[10px] text-slate-400">{ord.telefono_comprador || 'Sin teléfono'}</div>
                      </td>
                      <td className="py-4 px-2 text-slate-700 font-medium max-w-xs truncate">
                        {ord.products?.titulo || ord.product_titulo || 'Producto Digital'}
                      </td>
                      <td className="py-4 px-2">
                        {ord.captura_url ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt({
                              url: ord.captura_url,
                              nombre_comprador: ord.nombre_comprador,
                              referencia_pago: ord.referencia_pago
                            })}
                            className="inline-flex items-center gap-1 text-[#1E3A8A] font-bold hover:underline cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> Ver Recibo
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Sin captura</span>
                        )}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          ord.estado === 'aprobado'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ord.estado === 'rechazado'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.estado === 'aprobado' && <CheckCircle2 className="w-3 h-3" />}
                          {ord.estado === 'rechazado' && <XCircle className="w-3 h-3" />}
                          {ord.estado === 'pendiente' && <Clock className="w-3 h-3" />}
                          {ord.estado}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {ord.estado === 'pendiente' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(ord.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleReject(ord.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs active:scale-95 transition-all"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                        {ord.estado === 'aprobado' && (
                          <span className="text-[10px] font-bold text-emerald-600">✓ Enlace Enviado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBIR PRODUCTO SEMANAL */}
      {activeTab === 'nuevo-producto' && (
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 max-w-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-[#2C2C2C]">Subir Nuevo Producto Semanal (Monto / Aporte Libre)</h2>
            <p className="text-xs text-slate-500 font-medium">El archivo se guardará en la carpeta privada de Supabase Storage.</p>
          </div>

          {prodSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-2xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ¡Producto creado y activo exitosamente!
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Tipo de Producto *</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
              >
                <option value="libro">Libro PDF</option>
                <option value="excel">Plantilla Excel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Título del Producto *</label>
              <input
                type="text"
                required
                placeholder="Ej. Hábitos Atómicos — guía práctica para construir rutinas..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Descripción *</label>
              <textarea
                rows={3}
                placeholder="Resumen del libro o características de la plantilla..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Fecha Inicio</label>
                <input
                  type="date"
                  value={semanaInicio}
                  onChange={(e) => setSemanaInicio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#2C2C2C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Fecha Fin</label>
                <input
                  type="date"
                  value={semanaFin}
                  onChange={(e) => setSemanaFin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#2C2C2C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Archivo Digital (PDF o Excel) *</label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A8A]/10 file:text-[#1E3A8A]"
              />
            </div>

            <button
              type="submit"
              disabled={creatingProd}
              className="w-full py-3.5 btn-cta rounded-xl text-[#2C2C2C] font-black text-xs shadow-xs active:scale-95"
            >
              {creatingProd ? 'Guardando...' : 'Publicar Producto en Catálogo'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: GESTIONAR SOLICITUDES */}
      {activeTab === 'solicitude-admin' && (
        <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-[#2C2C2C]">Solicitudes de la Comunidad</h2>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#1E3A8A]">{req.tipo}</span>
                  <p className="text-xs font-bold text-[#2C2C2C]">{req.texto}</p>
                  <span className="text-[10px] text-slate-400 font-bold">{req.votos} votos</span>
                </div>

                <div className="flex items-center gap-2">
                  {req.estado !== 'programada' && (
                    <button
                      onClick={() => handleUpdateRequestStatus(req.id, 'programada')}
                      className="px-3 py-1.5 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Marcar Programada
                    </button>
                  )}
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 bg-white rounded-lg border border-slate-200">
                    {req.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MENSAJES DE CONTACTO */}
      {activeTab === 'mensajes' && (
        <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-[#2C2C2C]">Mensajes Recibidos del Widget de Contacto</h2>
              <p className="text-xs text-slate-500 font-medium">Consulta y gestiona los mensajes enviados por los usuarios desde la pasarela flotante.</p>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Total: {messages.length} | <span className="text-rose-600 font-black">{unreadMessagesCount} Sin Leer</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-xs text-slate-500 font-medium py-4">Cargando mensajes...</p>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No se han recibido mensajes de contacto todavía.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">Estado</th>
                    <th className="pb-3 px-2">Nombre</th>
                    <th className="pb-3 px-2">Correo Electrónico</th>
                    <th className="pb-3 px-2">Mensaje</th>
                    <th className="pb-3 px-2">Fecha y Hora</th>
                    <th className="pb-3 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {messages.map((msg) => (
                    <tr key={msg.id} className={msg.leido ? 'hover:bg-slate-50/50' : 'bg-rose-50/40 hover:bg-rose-50/60 font-semibold'}>
                      <td className="py-4 px-2">
                        {msg.leido ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600">
                            Leído
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white animate-pulse">
                            ● Nuevo
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2 font-bold text-[#2C2C2C]">{msg.nombre}</td>
                      <td className="py-4 px-2 text-slate-600">
                        {msg.email ? (
                          <a href={`mailto:${msg.email}`} className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {msg.email}
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No proporcionado</span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-slate-700 max-w-sm leading-relaxed">
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs shadow-2xs font-normal">
                          {msg.mensaje}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[11px] text-slate-500 font-mono">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString('es-CO') : 'Reciente'}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!msg.leido && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="px-3 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Marcar Leído
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar mensaje"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AUDITORÍA Y EXCEPCIONES */}
      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          {/* Sección Alertas y Salvaguardas */}
          <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="text-lg font-black text-[#2C2C2C]">Salvaguardas y Alertas de Excepción</h2>
                <p className="text-xs text-slate-500 font-medium">Monitoreo activo de discrepancias de monto, firmas inválidas o fallos de envío.</p>
              </div>
            </div>

            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium py-4 text-center">Sin alertas activas. El sistema opera normalmente.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alt) => (
                  <div key={alt.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs ${
                    alt.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-wider">
                        <span>[{alt.severity}]</span>
                        <span>{alt.alert_type}</span>
                        <span className="text-slate-400">• {new Date(alt.created_at).toLocaleString('es-CO')}</span>
                      </div>
                      <p className="font-semibold">{alt.message}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${alt.resuelto ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-200 text-amber-900 animate-pulse'}`}>
                        {alt.resuelto ? 'Resuelto' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección Logs Crudos de Auditoría */}
          <div className="glass-card bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Activity className="w-5 h-5 text-[#1E3A8A]" />
              <div>
                <h2 className="text-lg font-black text-[#2C2C2C]">Historial Inmutable de Auditoría de Pagos</h2>
                <p className="text-xs text-slate-500 font-medium">Registro cronológico de eventos crudos de Webhooks Wompi y conciliaciones automatizadas.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium py-4 text-center">No hay registros de auditoría almacenados aún.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="pb-3 px-2">Proveedor</th>
                      <th className="pb-3 px-2">Evento</th>
                      <th className="pb-3 px-2">Firma Válida</th>
                      <th className="pb-3 px-2">Monto Esperado / Recibido</th>
                      <th className="pb-3 px-2">Estado Previo ➔ Nuevo</th>
                      <th className="pb-3 px-2 text-right">Fecha / Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 uppercase font-black text-[#1E3A8A] text-[10px]">{log.provider}</td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-700">{log.event_type}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${log.signature_valid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {log.signature_valid ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono">
                          {log.monto_esperado ? `$${Number(log.monto_esperado).toLocaleString('es-CO')} COP` : '-'} / {log.monto_recibido ? `$${Number(log.monto_recibido).toLocaleString('es-CO')} COP` : '-'}
                        </td>
                        <td className="py-3 px-2 font-semibold">
                          <span className="text-slate-400">{log.estado_previo || 'nuevo'}</span> ➔ <span className="text-emerald-600 font-bold">{log.estado_nuevo}</span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-[11px] text-slate-500">
                          {new Date(log.created_at).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Previsualización de Comprobante */}
      <ReceiptPreviewModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

    </div>
  );
}
