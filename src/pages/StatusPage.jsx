import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchOrders } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Search, Download, Clock, AlertCircle, CheckCircle2, ArrowRight, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function StatusPage() {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('email') || '';
  const exito = searchParams.get('exito') === 'true';

  const [query, setQuery] = useState(initialRef);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const results = await searchOrders(query);
      setOrders(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      handleSearch();
    }
  }, [initialRef]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Botón Volver */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#111827] transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al catálogo
        </Link>
      </div>

      {/* Grid Principal en 2 Columnas para Escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: Banner y Buscador */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Banner de éxito post-checkout */}
          {exito && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-5 text-left flex items-start gap-3.5 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-emerald-900">
                  ¡Orden Registrada Exitosamente!
                </h3>
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  Tu comprobante con referencia <strong className="font-mono bg-emerald-100/70 px-1.5 py-0.5 rounded text-emerald-900">{initialRef}</strong> se ha recibido. El administrador verificará la transferencia en Bancolombia y habilitará tu descarga.
                </p>
              </div>
            </motion.div>
          )}

          {/* Tarjeta del Buscador */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                RASTREO DE PEDIDO
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight leading-tight">
                Consulta el estado de tu orden
              </h1>
              <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1.5">
                Ingresa tu <strong>Nombre del Pagador *</strong>, número de comprobante/referencia o correo electrónico registrado.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. BC-127098 o tu@correo.com"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-slate-100 focus:border-[#111827] focus:bg-white rounded-full pl-11 pr-4 py-3.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                    Buscando orden...
                  </>
                ) : (
                  'Buscar Orden'
                )}
              </button>
            </form>
          </div>

        </div>

        {/* COLUMNA DERECHA: Resultados */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {searched ? `Resultados de búsqueda (${orders.length})` : 'Información de Rastreo'}
            </h2>
            {searched && orders.length > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Acreditaciones activas
              </span>
            )}
          </div>

          {!searched ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827]">
                Ingresa tu código de referencia o correo
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
                Utiliza la casilla de la izquierda para verificar el avance de validación bancaria y acceder a tu enlace seguro de descarga.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-[#FF7A45] mx-auto" />
              <h3 className="text-sm font-bold text-[#111827]">
                No se encontraron órdenes con esos datos
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal leading-relaxed">
                Verifica el número de referencia (ej. BC-127098), el Nombre del Pagador o el correo ingresado e intenta nuevamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const token = ord.download_links?.[0]?.token || ord.token_descarga;
                const isAprobado = ord.estado === 'aprobado';
                const tituloProd = ord.products?.titulo || ord.product_titulo || 'Producto Digital de la Semana';

                return (
                  <motion.div
                    key={ord.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4"
                  >
                    {/* Fila 1: Ref, Título y Badge */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 block">
                          Ref: {ord.referencia_pago}
                        </span>
                        <h3 className="text-base font-black text-[#111827] mt-0.5">
                          {tituloProd}
                        </h3>
                      </div>
                      <StatusBadge estado={ord.estado} />
                    </div>

                    {/* Fila 2: Datos del Pagador y Acción */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="space-y-1 font-normal text-slate-600">
                        <p>Pagador: <strong className="font-bold text-[#111827]">{ord.nombre_comprador || 'No registrado'}</strong></p>
                        <p>Email: <strong className="font-bold text-[#111827]">{ord.email_comprador}</strong></p>
                        <p className="text-[11px] text-slate-400">Fecha: {new Date(ord.created_at).toLocaleString()}</p>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        {isAprobado && token ? (
                          <Link
                            to={`/descarga/${token}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-md active:scale-95 text-xs"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                            Ir a Descargar Producto
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : ord.estado === 'pendiente' ? (
                          <div className="inline-flex items-center gap-1.5 text-[#FF7A45] bg-[#FF7A45]/10 px-3.5 py-2 rounded-full border border-[#FF7A45]/20 text-[11px] font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            En verificación por el administrador.
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3.5 py-2 rounded-full border border-rose-200 text-[11px] font-bold">
                            Orden rechazada por verificación.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

