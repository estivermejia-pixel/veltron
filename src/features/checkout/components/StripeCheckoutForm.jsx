import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Lock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StripeCheckoutForm({ referenciaPago, orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/estado?ref=${referenciaPago}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Ocurrió un error al procesar el pago con la tarjeta.');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setCompleted(true);
      setLoading(false);
      if (typeof onSuccess === 'function') {
        onSuccess(paymentIntent);
      } else {
        setTimeout(() => {
          navigate(`/estado?ref=${referenciaPago}`);
        }, 1500);
      }
    } else {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-black text-emerald-800">
          ¡Pago con Tarjeta Aprobado Exitosamente!
        </h4>
        <p className="text-xs text-emerald-700 font-medium">
          Tu transacción se procesó correctamente. Redirigiendo a tu orden de descarga...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-[#111827]">
          Datos de Tarjeta (Stripe PCI Blindado)
        </span>
        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/60">
          <Lock className="w-3 h-3" /> Cifrado 256-bit
        </span>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Componente Stripe PaymentElement nativo */}
      <div className="min-h-[160px]">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 px-6 rounded-2xl bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            Procesando Pago Seguro...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-emerald-400" />
            Confirmar y Pagar con Tarjeta
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 font-normal text-center">
        Los datos de tu tarjeta son procesados directamente por Stripe. Veltron Capital nunca almacena información bancaria.
      </p>
    </form>
  );
}
