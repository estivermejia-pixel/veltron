import React, { useState } from 'react';
import { Copy, Check, Download, Wallet } from 'lucide-react';
import { BANCOLOMBIA_LLAVE } from '../../../config/env';
import { motion, useReducedMotion } from 'framer-motion';

export default function QRCodePaymentCard({ llave = BANCOLOMBIA_LLAVE, onPayWompi }) {
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

  const containerVariants = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 } };

  return (
    <motion.div
      className="flex flex-col items-start w-full max-w-full sm:max-w-[358px] mr-auto h-full space-y-3"
      {...containerVariants}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Imagen del Código QR Limpia */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-white rounded-3xl p-2 border border-slate-100 shadow-2xs">
        <img
          src="/qr_code_only.png"
          alt="Código QR Oficial Veltron Capital"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Botón Oscuro: Copiar Llave */}
      <div className="w-full">
        <motion.button
          onClick={handleCopy}
          type="button"
          whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 shadow-xs min-h-[44px] cursor-pointer ${
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

      {/* BOTÓN PAGAR WOMPI DEBAJO DE COPIAR LLAVE */}
      {onPayWompi && (
        <div className="w-full">
          <motion.button
            onClick={onPayWompi}
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#FF7A45] hover:bg-[#e86938] text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Wallet className="w-4 h-4 text-white" />
            Pagar Wompi (Nequi / PSE / Tarjeta)
          </motion.button>
        </div>
      )}

      {/* Botón Descargar QR en JPG */}
      <motion.button
        onClick={handleDownloadQR}
        type="button"
        disabled={downloading}
        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[40px] border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        {downloading ? 'Descargando...' : 'Descargar QR (.jpg)'}
      </motion.button>
    </motion.div>
  );
}
