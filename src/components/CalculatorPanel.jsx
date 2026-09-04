import React from 'react';

export default function CalculatorPanel({ amount, setAmount, veltrons, step, onProceed }) {
  // En este diseño, la opacidad baja si el usuario avanza a PAGO/SUCCESS pero la tarjeta principal podría no desaparecer.
  // El HTML indica "island-transition", lo mantenemos base.
  const isOpacityReduced = step !== 'QUOTE';

  return (
    <div className={`lg:col-span-4 glass-card p-8 rounded-3xl island-transition ${isOpacityReduced ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
        <h3 className="font-headline-md text-headline-md">Intercambiar Activos</h3>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1">Pagas</label>
          <div className="relative group">
            <input 
              type="number" 
              className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-4 py-4 font-headline-md text-headline-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-xl border border-outline-variant/20">
              <span className="font-label-md">COP</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-primary-container p-2 rounded-full text-on-primary-container shadow-md">
            <span className="material-symbols-outlined">swap_vert</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant ml-1">Recibes</label>
          <div className="relative group">
            <input 
              type="number" 
              className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-4 py-4 font-headline-md text-headline-md text-primary" 
              placeholder="0.00" 
              value={veltrons}
              readOnly 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">
              <span className="font-label-md text-primary">VTR</span>
            </div>
          </div>
          <p className="text-label-sm font-label-sm text-outline text-right mt-1">1 VTR = 1,000 COP</p>
        </div>

        <button 
          onClick={onProceed}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full primary-gradient-btn py-4 rounded-2xl text-white font-headline-md text-headline-md shadow-xl shadow-primary/30 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Revisar Transacción
        </button>
      </div>
    </div>
  );
}
