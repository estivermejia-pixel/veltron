import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';

export default function WompiCheckoutWidget({ wompiConfig, onSuccess, onError }) {
  const [loadingScript, setLoadingScript] = useState(true);
  const [openingWidget, setOpeningWidget] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Cargar script oficial de Wompi Checkout si no está presente
    if (window.WidgetCheckout) {
      setLoadingScript(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => setLoadingScript(false);
    script.onerror = () => {
      setScriptError(true);
      setLoadingScript(false);
    };
    document.body.appendChild(script);

    return () => {
      // Opcional: mantener script en caché global
    };
  }, []);

  const handleOpenWompi = () => {
    if (!wompiConfig) return;

    if (wompiConfig.isMock) {
      // En modo mock / desarrollo sin backend activo, simulamos redirección exitosa
      setOpeningWidget(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ reference: wompiConfig.referencia_pago });
        } else {
          window.location.href = `/estado?ref=${encodeURIComponent(wompiConfig.referencia_pago)}&exito=true`;
        }
      }, 1500);
      return;
    }

    if (!window.WidgetCheckout) {
      if (onError) onError('El script de Wompi aún no ha terminado de cargar.');
      return;
    }

    setOpeningWidget(true);

    const redirectUrl = `${window.location.origin}/estado?ref=${encodeURIComponent(wompiConfig.referencia_pago)}&exito=true`;

    const checkout = new window.WidgetCheckout({
      currency: wompiConfig.currency || 'COP',
      amountInCents: wompiConfig.amountInCents,
      reference: wompiConfig.referencia_pago,
      publicKey: wompiConfig.publicKey,
      signature: {
        integrity: wompiConfig.integritySignature
      },
      redirectUrl: redirectUrl
    });

    checkout.open((result) => {
      setOpeningWidget(false);
      const transaction = result.transaction;
      console.log('Resultado de checkout Wompi:', transaction);
      if (transaction && transaction.status === 'APPROVED') {
        if (onSuccess) {
          onSuccess(transaction);
        } else {
          window.location.href = redirectUrl;
        }
      }
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-xs font-black uppercase text-[#1E3A8A] tracking-wider">
        <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" /> Pasarela Directa Wompi Bancolombia
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-left shadow-2xs">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Referencia de orden:</span>
          <span className="font-mono font-bold text-[#111827]">{wompiConfig?.referencia_pago}</span>
        </div>
        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">Monto a pagar:</span>
          <span className="font-black text-[#111827] text-sm">
            ${((wompiConfig?.amountInCents || 0) / 100).toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
          <Zap className="w-3.5 h-3.5 fill-emerald-600" />
          <span>Métodos soportados: Nequi, PSE, Tarjeta Débito y Crédito</span>
        </div>
      </div>

      {scriptError && (
        <p className="text-xs text-rose-600 font-semibold">
          No se pudo cargar el script de Wompi. Por favor revisa tu conexión.
        </p>
      )}

      <button
        type="button"
        onClick={handleOpenWompi}
        disabled={loadingScript || openingWidget || scriptError}
        className="w-full py-4 px-6 rounded-2xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loadingScript ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#111827]" />
            Cargando Pasarela Segura...
          </>
        ) : openingWidget ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#111827]" />
            Abriendo Widget de Pago...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-[#111827]" />
            <span>Pagar con</span>
            <img src="/wompi-logo.png" alt="Wompi" className="h-5 object-contain shrink-0" />
            <ArrowRight className="w-4 h-4 ml-auto" />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 font-normal">
        Tus datos están protegidos directamente por la infraestructura de Wompi Bancolombia.
      </p>
    </div>
  );
}
