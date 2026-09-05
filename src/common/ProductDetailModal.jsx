import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Sparkles, CheckCircle2, Truck, DollarSign, TrendingUp, Clock, BarChart3, Target, Users, Lightbulb, ShieldCheck } from 'lucide-react';

export default function ProductDetailModal({ isOpen, onClose, onPayWompi }) {
  const shouldReduceMotion = useReducedMotion();

  if (!isOpen) return null;

  const backdropVariants = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const modalVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 }
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Fondo oscuro con Blur */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={onClose}
            {...backdropVariants}
            transition={{ duration: 0.2 }}
          />

          {/* Tarjeta Modal Centrada */}
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            {...modalVariants}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header Modal */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-[#1E3A8A] to-slate-900 text-white flex items-center justify-between border-b border-blue-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    Producto Digital de la Semana
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    Dashboard Logístico en Excel
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
              
              {/* Bajada Ejecutivo/Corporativo */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-2.5">
                <p className="font-extrabold text-[#111827] text-sm sm:text-base tracking-tight">
                  Solución analítica ejecutiva para la gestión integral de operaciones logísticas.
                </p>
                <p className="text-slate-600 font-medium leading-relaxed text-xs">
                  Plataforma en Excel diseñada para <strong>centralizar, supervisar y evaluar la cadena de suministro</strong>. Permite la visualización consolidada de indicadores clave de gestión (KPIs) en transporte, entregas, costos operativos y procesamiento de pedidos.
                </p>
              </div>

              {/* Imagen de Vista Previa */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white">
                <img
                  src="/excel_dashboard_preview.png"
                  alt="Vista Previa Oficial Dashboard Logístico Excel"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Ficha Técnica y Especificaciones del Modelo */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Especificaciones Técnicas del Modelo</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Estructura 100% editable y personalizable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Conexión dinámica a bases de datos configurables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Fórmulas avanzadas desarrolladas en español</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sin celdas bloqueadas ni hojas ocultas</span>
                  </div>
                </div>
              </div>

              {/* Lista de Capacidades Analíticas */}
              <div className="space-y-3">
                <h3 className="font-black text-[#111827] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Capacidades Analíticas Operativas:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Monitoreo de Pedidos y Entregas</strong>
                      <span className="text-[11px] text-slate-500">Control continuo del flujo operativo y despachos.</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Evaluación de Transporte y Nodos</strong>
                      <span className="text-[11px] text-slate-500">Diagnóstico de eficiencia en flotas y centros.</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Auditoría de Costos Logísticos</strong>
                      <span className="text-[11px] text-slate-500">Identificación y control de gastos operativos.</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Indicadores Clave (KPIs)</strong>
                      <span className="text-[11px] text-slate-500">Medición estandarizada del rendimiento.</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Prevención de Incumplimientos</strong>
                      <span className="text-[11px] text-slate-500">Detección oportuna de demoras y contingencias.</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-start gap-3">
                    <BarChart3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">Análisis de Tendencias</strong>
                      <span className="text-[11px] text-slate-500">Identificación de áreas de optimización.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perfil de Aplicación Corporativa */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-2">
                <h3 className="font-black text-[#1E3A8A] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Perfil de Aplicación Corporativa</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Diseñado para <strong>empresas, directivos, coordinadores de logística, supervisores de distribución, jefes de almacén y analistas de operaciones</strong> que requieren un control analítico riguroso sin incurrir en licencias ni desarrollos de software complejos.
                </p>
              </div>

              {/* Propuesta de Valor Ejecutivo */}
              <div className="bg-[#FEFCE8] p-5 rounded-2xl border border-amber-200/90 space-y-3">
                <h3 className="font-black text-amber-950 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>Propuesta de Valor Ejecutivo</span>
                </h3>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  Sustituya la dispersión de datos y múltiples archivos heterogéneos por un modelo analítico unificado, estructurado y de lectura inmediata. La herramienta procesa los datos de origen y los transforma de forma automática en métricas ejecutivas para la toma de decisiones informadas y oportunas.
                </p>
                <div className="pt-2 text-xs font-bold text-slate-900 border-t border-amber-200/80">
                  Mayor control operativo · Reducción de tiempo analítico · Decisiones basadas en datos
                </div>
              </div>

            </div>

            {/* Footer Modal con Botón CTA */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Incluido con tu aporte libre (Comisión $0 COP)</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors w-full sm:w-auto cursor-pointer"
                >
                  Cerrar
                </button>
                {onPayWompi && (
                  <button
                    onClick={() => {
                      onClose();
                      onPayWompi();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                  >
                    Obtener Producto Ahora
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
