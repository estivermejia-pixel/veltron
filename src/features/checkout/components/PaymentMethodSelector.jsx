import React from 'react';
import { CreditCard, QrCode, Zap, ShieldCheck } from 'lucide-react';

export default function PaymentMethodSelector({ selectedMethod, onChange }) {
  return (
    <div className="space-y-3 mb-6">
      <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
        Método de Pago Preferido *
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Opción 1: Llave Bancolombia / Bre-B */}
        <button
          type="button"
          onClick={() => onChange('bre-b')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            selectedMethod === 'bre-b'
              ? 'bg-white border-[#111827] shadow-sm ring-2 ring-[#111827]/10'
              : 'bg-slate-50/70 border-slate-200/80 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Comisión $0 COP
            </span>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
              Llave Bancolombia / Bre-B
            </h4>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-0.5">
              Transfiere desde tu banco y sube el comprobante. Validación en minutos.
            </p>
          </div>
        </button>

        {/* Opción 2: Tarjeta de Crédito / Débito (Stripe) */}
        <button
          type="button"
          onClick={() => onChange('stripe')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            selectedMethod === 'stripe'
              ? 'bg-white border-[#111827] shadow-sm ring-2 ring-[#111827]/10'
              : 'bg-slate-50/70 border-slate-200/80 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" /> Entrega Inmediata
            </span>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
              Tarjeta Débito / Crédito
            </h4>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-0.5">
              Pago seguro por Stripe. Aprobación y enlace de descarga instantáneo.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
