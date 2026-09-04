import React, { useState } from 'react';
import { Copy, Check, QrCode as QrIcon, Download } from 'lucide-react';
import { BANCOLOMBIA_LLAVE } from '../services/api';

export default function QRCodeSimulated({ llave = BANCOLOMBIA_LLAVE }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      // Cargar la imagen original (PNG) y convertirla a JPG via canvas
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

      // Fondo blanco (JPG no soporta transparencia)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Descargar como JPG
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

  return (
    <div className="flex flex-col justify-between items-start w-full max-w-[358px] mr-auto h-full space-y-0">

      {/* Imagen del Código QR Directa */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <img
          src="/qr_code_only.png"
          alt="Código QR Oficial Veltron Capital"
          className="w-full h-full object-contain"
        />

        {/* Badge Flotante "escanear" en amarillo */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1E1E1E] bg-[#FFD53D] px-5 py-2 rounded-full border border-yellow-300 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <QrIcon className="w-3.5 h-3.5 text-[#1E1E1E]" />
            escanear
          </span>
        </div>
      </div>

      {/* Botón Oscuro: Copiar Llave */}
      <div className="mt-8 w-full">
      <button
        onClick={handleCopy}
        type="button"
        className={`w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs min-h-[44px] ${copied
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
      </button>
      </div>

      {/* Botón Descargar QR en JPG */}
      <button
        onClick={handleDownloadQR}
        type="button"
        disabled={downloading}
        className="mt-3 w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[40px] border-2 border-[#262626] text-[#262626] hover:bg-[#262626] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {downloading ? 'Descargando...' : 'Descargar QR'}
      </button>

    </div>
  );
}
