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
              
              {/* Bajada y Resumen */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <p className="font-black text-[#111827] text-sm sm:text-base">
                  Convierte tus datos logísticos en decisiones inteligentes.
                </p>
                <p className="text-slate-600 font-medium leading-normal text-xs">
                  Un dashboard diseñado para <strong>centralizar, controlar y analizar toda la operación logística desde Excel</strong>, permitiéndote visualizar en un solo lugar los principales indicadores de transporte, entregas, costos, pedidos y desempeño.
                </p>
              </div>

              {/* Imagen de Vista Previa */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <img
                  src="/excel_dashboard_preview.png"
                  alt="Vista Previa Real Dashboard Logístico Excel"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Lista de Capacidades */}
              <div className="space-y-3">
                <h3 className="font-black text-[#111827] text-sm uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Con esta herramienta podrás:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Controlar pedidos y entregas</strong>
                      <span className="text-[11px] text-slate-500">Monitoreo en tiempo real.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Desempeño de transporte</strong>
                      <span className="text-[11px] text-slate-500">Evaluación por centros de distribución.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Costos logísticos</strong>
                      <span className="text-[11px] text-slate-500">Identifica y controla gastos operativos.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Indicadores clave (KPIs)</strong>
                      <span className="text-[11px] text-slate-500">Medición precisa de la operación.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Detectar retrasos</strong>
                      <span className="text-[11px] text-slate-500">Prevención de incumplimientos de entrega.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                    <BarChart3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Visualizar tendencias</strong>
                      <span className="text-[11px] text-slate-500">Oportunidades inmediatas de mejora.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ¿Para quién es? */}
              <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 space-y-2">
                <h3 className="font-black text-[#1E3A8A] text-sm uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1E3A8A]" />
                  <span>🚀 ¿Para quién es?</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Ideal para <strong>empresas, emprendedores, coordinadores logísticos, supervisores de transporte, administradores de almacenes y profesionales de operaciones</strong> que necesitan tener mayor control sin invertir en un software logístico costoso.
                </p>
              </div>

              {/* Propuesta de Valor */}
              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3">
                <h3 className="font-black text-amber-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>💡 La propuesta de valor</span>
                </h3>
                <p className="text-xs text-amber-950 font-bold">
                  Deja de trabajar con múltiples archivos y datos dispersos. Centraliza tu información en un dashboard profesional, visual y fácil de usar.
                </p>
                <p className="text-xs text-amber-900 font-medium">
                  Tú ingresas los datos. El dashboard convierte la información en indicadores para saber qué está pasando, dónde están los problemas y dónde puedes mejorar.
                </p>
                <div className="pt-2 text-xs font-black text-slate-900 border-t border-amber-200/80">
                  👉 Más control. Menos tiempo buscando información. Mejores decisiones.
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
