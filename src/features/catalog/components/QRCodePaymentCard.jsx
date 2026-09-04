import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { BANCOLOMBIA_LLAVE } from '../../../config/env';
import { motion, useReducedMotion } from 'framer-motion';

export default function QRCodePaymentCard({ llave = BANCOLOMBIA_LLAVE, onPayWompi }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(llave);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadQR = async () => {
    setDownloading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/qr_code_only.png';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = 'QR_VeltronCapital.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (e) {
      console.error('Error al descargar el QR:', e);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const handleTouchEnd = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      handleDownloadQR();
    }
    setLastTap(now);
  };

  const containerVariants = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 } };

  return (
    <motion.div
      className="flex flex-col items-start w-full max-w-full sm:max-w-[358px] mr-auto h-full space-y-3"
      {...containerVariants}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Imagen del Código QR — Doble clic o 2 toques para descargar */}
      <div className="w-full flex flex-col items-center">
        <div
          onDoubleClick={handleDownloadQR}
          onTouchEnd={handleTouchEnd}
          className="relative w-full aspect-square flex items-center justify-center bg-white rounded-3xl p-2 border border-slate-100 shadow-2xs cursor-pointer group select-none"
          title="Doble clic o 2 toques para descargar el código QR"
        >
          <img
            src="/qr_code_only.png"
            alt="Código QR Oficial Veltron Capital"
            className="w-full h-full object-contain pointer-events-none"
          />

          {downloading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-3xl flex items-center justify-center font-black text-xs text-[#111827] shadow-inner">
              ¡Descargando QR (.jpg)!
            </div>
          )}
        </div>
        <span className="text-[10px] font-semibold text-slate-400 mt-1.5 text-center">
          Doble clic o 2 toques sobre el QR para descargarlo
        </span>
      </div>

      {/* Botón Oscuro: Copiar Llave (con logo oficial Bre-B) */}
      <div className="w-full pt-1">
        <motion.button
          onClick={handleCopy}
          type="button"
          whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors duration-200 active:scale-95 shadow-xs min-h-[44px] cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-[#262626] hover:bg-[#1a1a1a] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              ¡Llave copiada!
            </>
          ) : (
            <>
              <img src="/bre-b-logo.png" alt="Bre-B Logo" className="h-4 sm:h-4.5 object-contain shrink-0" />
              <span>Copiar Llave: {llave}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* BOTÓN PAGAR CON WOMPI DEBAJO DE COPIAR LLAVE (CON LOGO WOMPI OFICIAL) */}
      {onPayWompi && (
        <div className="w-full">
          <motion.button
            onClick={onPayWompi}
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <span>Pagar con</span>
            <img src="/wompi-logo.png" alt="Wompi" className="h-4.5 sm:h-5 object-contain shrink-0" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

