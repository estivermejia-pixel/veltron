import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Upload, Download, Cpu, CheckCircle2, AlertTriangle, X, RefreshCw } from 'lucide-react';

/**
 * FileLoadingOverlay
 * Componente de overlay cinematográfico con telemetría de progreso e indicadores de actividad
 * inspirado técnicamente en UplinkLoader de ThreeUI, adaptado a la identidad de Veltron Capital.
 */
export default function FileLoadingOverlay({
  visible = false,
  progress = 0,
  operation = 'upload', // 'upload' | 'download' | 'processing'
  status = 'uploading', // 'idle' | 'uploading' | 'downloading' | 'processing' | 'success' | 'error'
  fileName = '',
  errorMessage = '',
  onClose,
  onRetry,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [fakeLatency, setFakeLatency] = useState(12);

  // Simulación sutil de varianza de latencia para el HUD de telemetría
  useEffect(() => {
    if (!visible || status === 'success' || status === 'error') return;
    const interval = setInterval(() => {
      setFakeLatency(Math.floor(Math.random() * 8) + 10);
    }, 1200);
    return () => clearInterval(interval);
  }, [visible, status]);

  if (!visible && status === 'idle') return null;

  // Icono principal según operación o estado
  const renderStatusIcon = () => {
    if (status === 'success') {
      return <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
    }
    if (status === 'error') {
      return <AlertTriangle className="w-8 h-8 text-rose-400" />;
    }
    if (operation === 'download' || status === 'downloading') {
      return <Download className="w-8 h-8 text-[#FFD53D] animate-bounce" />;
    }
    if (operation === 'processing' || status === 'processing') {
      return <Cpu className="w-8 h-8 text-amber-400 animate-pulse" />;
    }
    return <Upload className="w-8 h-8 text-[#FFD53D] animate-pulse" />;
  };

  // Etiqueta de título principal
  const getTitle = () => {
    if (status === 'success') return '¡OPERACIÓN COMPLETADA!';
    if (status === 'error') return 'ERROR DE PROCESAMIENTO';
    if (operation === 'download' || status === 'downloading') return 'DESCARGANDO ARCHIVO DIGITAL';
    if (operation === 'processing' || status === 'processing') return 'VERIFICANDO COMPROBANTE...';
    return 'SUBIENDO ARCHIVO SEGURO...';
  };

  // Texto descriptivo secundario
  const getSubtitle = () => {
    if (status === 'success') return 'Verificación y transferencia finalizadas con éxito.';
    if (status === 'error') return errorMessage || 'Ocurrió un inconveniente al procesar el archivo.';
    if (operation === 'download' || status === 'downloading') return 'Generando enlace firmado e iniciando transferencia...';
    if (operation === 'processing' || status === 'processing') return 'Validando checksum y registrando en la base de datos...';
    return 'Cargando archivo en los servidores seguros de Supabase Storage...';
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001233]/85 backdrop-blur-xl overflow-hidden font-sans"
        >
          {/* Capa de líneas de escaneo (Scanlines) sutiles y rejilla de fondo estilo Uplink */}
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Barra reflectiva de escaneo vertical en bucle */}
          {!shouldReduceMotion && status !== 'success' && status !== 'error' && (
            <motion.div
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[#FFD53D]/10 to-transparent pointer-events-none"
              animate={{ y: ['-100%', '1000%'] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            />
          )}

          {/* Tarjeta HUD principal estilo Veltron Capital */}
          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#0b192e] to-[#040d1a] border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6 text-white"
          >
            {/* Destello de neón de fondo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFD53D]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Cabecera de Telemetría Superior */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">UPLINK_STATUS: ACTIVE</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>PORT: 443_SSL</span>
                <span>LATENCY: {fakeLatency}ms</span>
              </div>
            </div>

            {/* Bloque Central de Operación */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {/* Anillo orbital giratorio */}
                {status !== 'success' && status !== 'error' && !shouldReduceMotion && (
                  <motion.div
                    className="absolute -inset-1 rounded-2xl border-2 border-dashed border-[#FFD53D]/40 pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  />
                )}
                <div className="w-14 h-14 rounded-2xl bg-[#001233] border border-slate-700/80 flex items-center justify-center shadow-inner">
                  {renderStatusIcon()}
                </div>
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  {getTitle()}
                </h3>
                {fileName && (
                  <p className="text-xs font-mono text-[#FFD53D] truncate bg-[#FFD53D]/10 px-2 py-0.5 rounded border border-[#FFD53D]/20 inline-block max-w-full">
                    📄 {fileName}
                  </p>
                )}
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {getSubtitle()}
                </p>
              </div>

              {/* Botón de cierre en error */}
              {(status === 'error' || status === 'success') && onClose && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Barra de Progreso Cinematográfica */}
            {status !== 'error' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">
                    {status === 'success' ? 'TRANSFERENCIA: 100%' : `PROGRESO: ${Math.min(100, Math.max(0, Math.round(progress)))}%`}
                  </span>
                  <span className="text-[#FFD53D] font-bold">
                    {status === 'success' ? 'VERIFIED' : progress < 100 ? 'PROCESSING' : 'FINALIZING'}
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-900/90 rounded-full border border-slate-700/80 overflow-hidden p-0.5 relative">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFD53D] via-[#F59E0B] to-[#1E3A8A] shadow-[0_0_12px_rgba(255,213,61,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${status === 'success' ? 100 : Math.min(100, Math.max(5, progress))}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Pie de Acciones / Errores */}
            {status === 'error' && (
              <div className="pt-2 flex items-center justify-end gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    Cerrar
                  </button>
                )}
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-4 py-2 rounded-xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] text-xs font-black flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reintentar
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
