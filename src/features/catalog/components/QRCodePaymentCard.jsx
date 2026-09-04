import React, { useState } from 'react';
import { Copy, Check, QrCode as QrIcon, Download } from 'lucide-react';
import { BANCOLOMBIA_LLAVE } from '../../../config/env';
import { motion, useReducedMotion } from 'framer-motion';

export default function QRCodePaymentCard({ llave = BANCOLOMBIA_LLAVE }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
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
      setDownloading(false);
    }
  };

  // Variantes de animación (desactivadas si el usuario prefiere movimiento reducido)
  const containerVariants = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 } };

  return (
    <motion.div
      className="flex flex-col items-start w-full max-w-full sm:max-w-[358px] mr-auto h-full space-y-0"
      {...containerVariants}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >

      {/* Imagen del Código QR */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <img
          src="/qr_code_only.png"
          alt="Código QR Oficial Veltron Capital"
          className="w-full h-full object-contain"
        />

        {/* Badge Flotante "LISTO PARA ESCANEAR" */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1E1E1E] bg-[#FFD53D] px-5 py-2 rounded-full border border-yellow-300 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <QrIcon className="w-3.5 h-3.5 text-[#1E1E1E]" />
            LISTO PARA ESCANEAR
          </span>
        </div>
      </div>

      {/* Botón Oscuro: Copiar Llave */}
      <div className="mt-8 w-full">
        <motion.button
          onClick={handleCopy}
          type="button"
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 shadow-xs min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#FFD53D] ${
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
              <Copy className="w-4 h-4 text-slate-300" />
              Copiar Llave: {llave}
            </>
          )}
        </motion.button>
      </div>

      {/* Botón Descargar QR en JPG */}
      <motion.button
        onClick={handleDownloadQR}
        type="button"
        disabled={downloading}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="mt-3 w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[44px] border-2 border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#FFD53D]"
      >
        <motion.span
          animate={downloading && !shouldReduceMotion ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ display: 'inline-flex' }}
        >
          <Download className="w-4 h-4" />
        </motion.span>
        {downloading ? 'Descargando...' : 'Descargar QR (.jpg)'}
      </motion.button>

    </motion.div>
  );
}
