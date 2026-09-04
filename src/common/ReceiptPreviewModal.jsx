import React, { useEffect } from 'react';
import { X, Download, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function ReceiptPreviewModal({ receipt, onClose }) {
  const shouldReduceMotion = useReducedMotion();

  // Escuchar tecla Escape para cerrar
  useEffect(() => {
    if (!receipt) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [receipt, onClose]);

  if (!receipt) return null;

  const url = typeof receipt === 'string' ? receipt : receipt.url;
  const nombre = typeof receipt === 'object' ? receipt.nombre_comprador : 'Comprador';
  const referencia = typeof receipt === 'object' ? receipt.referencia_pago : '';

  // Detección de formato por extensión o contenido de la URL
  const cleanUrl = (url || '').toLowerCase();
  const isPdf = cleanUrl.includes('.pdf');

  const overlayVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
      };

  const modalVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 10 },
        transition: { duration: 0.25, ease: 'easeOut' }
      };

  const filename = `Comprobante_${referencia || 'Veltron'}_${nombre.replace(/\s+/g, '_')}${isPdf ? '.pdf' : '.jpg'}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          {...modalVariants}
        >
          {/* Header del Modal */}
          <div className="px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-slate-50/70">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1E3A8A] bg-[#1E3A8A]/10 px-2.5 py-0.5 rounded-md">
                  {isPdf ? 'Documento PDF' : 'Captura de Imagen'}
                </span>
                {referencia && (
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Ref: {referencia}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black text-[#111827] truncate mt-1">
                Comprobante de pago — {nombre}
              </h3>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-[#111827] rounded-full hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body del Modal: Visor de Imagen o PDF */}
          <div className="p-4 sm:p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-100/60 min-h-[300px]">
            {isPdf ? (
              <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                <iframe
                  src={url}
                  title={`Comprobante PDF - ${nombre}`}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="relative max-h-[75vh] max-w-full flex items-center justify-center">
                <img
                  src={url}
                  alt={`Comprobante de ${nombre}`}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-sm border border-slate-200/80 bg-white"
                />
              </div>
            )}
          </div>

          {/* Footer del Modal */}
          <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-white">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              {isPdf ? <FileText className="w-4 h-4 text-[#1E3A8A]" /> : <ImageIcon className="w-4 h-4 text-emerald-600" />}
              <span>Verifica el valor transferido y la fecha antes de aprobar.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Abrir en pestaña nueva"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Pestaña Nueva
              </a>

              <a
                href={url}
                download={filename}
                className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Comprobante
              </a>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
