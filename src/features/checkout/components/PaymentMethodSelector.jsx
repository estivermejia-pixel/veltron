import React from 'react';
import { QrCode, Zap, Wallet } from 'lucide-react';

export default function PaymentMethodSelector({ selectedMethod, onChange }) {
  return (
    <div className="space-y-3 mb-6">
      <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
        Método de Pago Preferido *
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Opción 1: Wompi - RECOMENDADO */}
        <button
          type="button"
          onClick={() => onChange('wompi')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
            selectedMethod === 'wompi'
              ? 'bg-white border-[#FFD53D] shadow-sm ring-2 ring-[#FFD53D]/50'
              : 'bg-slate-50/70 border-slate-200/80 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="h-7 flex items-center">
              <img src="/wompi-logo.png" alt="Wompi" className="h-6 object-contain" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#111827] bg-[#FFD53D] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 fill-[#111827]" /> Instantáneo
            </span>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#111827]">
              Wompi (Nequi / PSE / Tarjetas)
            </h4>
            <p className="text-[10px] text-slate-500 font-normal leading-relaxed mt-0.5">
              Pago directo en Colombia. Aprobación automática sin enviar recibo.
            </p>
          </div>
        </button>

        {/* Opción 2: Llave Bancolombia / Bre-B */}
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
            <div className="h-7 flex items-center">
              <img src="/bre-b-logo-dark.png" alt="Bre-B" className="h-5 object-contain" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Comisión $0
            </span>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#111827]">
              Llave Bre-B (Manual)
            </h4>
            <p className="text-[10px] text-slate-500 font-normal leading-relaxed mt-0.5">
              Transfiere desde tu banco y sube el comprobante. Verificación en 5-15 min.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
