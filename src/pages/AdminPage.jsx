import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus, createProduct, getRequests, updateRequestStatus } from '../services/api';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Plus, ExternalLink, RefreshCw, FileText } from 'lucide-react';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ordenes');

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
      const [ordData, reqData] = await Promise.all([
        getAdminOrders(),
        getRequests()
      ]);
      setOrders(ordData);
      setRequests(reqData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    try {
      await createProduct(
        { titulo, tipo, descripcion, semana_inicio: semanaInicio, semana_fin: semanaFin },
        file,
        null
      );
      setTitulo('');
      setDescripcion('');
      setFile(null);
      setProdSuccess(true);
      setTimeout(() => setProdSuccess(false), 4000);
      loadData();
    } catch (err) {
      console.error(err);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C2C2C] text-[#FFD53D] text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Panel Administrativo
          </div>
          <h1 className="text-2xl font-black text-[#2C2C2C]">Verificación de Pagos Manuales</h1>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#2C2C2C] flex items-center gap-2 shadow-xs active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
        </button>
      </div>

      {/* Tabs de Navegación Admin */}
      <div className="flex items-center gap-3 border-b border-slate-200/80">
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
      </div>

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
                          <a
                            href={ord.captura_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#1E3A8A] font-bold hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" /> Ver Recibo
                          </a>
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

    </div>
  );
}
