import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchOrders } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Search, Download, Clock, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function StatusPage() {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('email') || '';
  const exito = searchParams.get('exito') === 'true';

  const [query, setQuery] = useState(initialRef);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      
      {/* Banner de éxito */}
      {exito && (
        <div className="glass-card bg-[#FFD53D]/20 border border-[#FFD53D] rounded-3xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FFD53D] text-[#2C2C2C] flex items-center justify-center mx-auto shadow-xs font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#2C2C2C]">¡Orden Registrada Exitosamente!</h2>
          <p className="text-xs text-slate-700 max-w-lg mx-auto font-medium">
            Tu comprobante con referencia <strong>{initialRef}</strong> se ha recibido. El administrador verificará la transferencia en Bancolombia y habilitará tu descarga.
          </p>
        </div>
      )}

      {/* Buscador de Estado */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Consulta el estado de tu orden</h1>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Ingresa tu <strong>Nombre del Pagador *</strong>, número de comprobante/referencia o correo electrónico registrado.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Ej. Esdras Mejia Tovar, BC-99881122 o tu@correo.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none transition-colors shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-6 btn-primary font-black text-[#2C2C2C] rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar Orden'}
          </button>
        </form>
      </div>

      {/* Resultados */}
      {searched && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Resultados de búsqueda ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-[#FF7A45] mx-auto" />
              <p className="text-[#2C2C2C] font-bold">No se encontraron órdenes con esos datos.</p>
              <p className="text-xs text-slate-500 font-medium">Verifica tu Nombre del Pagador, número de referencia o email e intenta nuevamente.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const token = ord.download_links?.[0]?.token || ord.token_descarga;
              const isAprobado = ord.estado === 'aprobado';
              const tituloProd = ord.products?.titulo || ord.product_titulo || 'Producto Digital';

              return (
                <div
                  key={ord.id}
                  className="glass-card rounded-3xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/60 pb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-500">Ref: {ord.referencia_pago}</span>
                      <h3 className="text-base font-bold text-[#2C2C2C]">{tituloProd}</h3>
                    </div>
                    <StatusBadge estado={ord.estado} />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-600 font-medium">
                    <div>
                      <p>Pagador: <strong className="text-[#2C2C2C]">{ord.nombre_comprador || 'No registrado'}</strong></p>
                      <p>Email: <strong className="text-[#2C2C2C]">{ord.email_comprador}</strong></p>
                      <p className="text-[11px] text-slate-400">Fecha: {new Date(ord.created_at).toLocaleString()}</p>
                    </div>

                    {isAprobado && token ? (
                      <Link
                        to={`/descarga/${token}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-extrabold rounded-2xl transition-all shadow-xs active:scale-95 text-xs"
                      >
                        <Download className="w-4 h-4" />
                        Ir a Descargar Producto
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : ord.estado === 'pendiente' ? (
                      <div className="flex items-center gap-1.5 text-[#FF7A45] bg-[#FF7A45]/10 px-3 py-1.5 rounded-xl border border-[#FF7A45]/30 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        En verificación por el administrador.
                      </div>
                    ) : (
                      <div className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 text-[11px] font-bold">
                        Orden rechazada por verificación.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
