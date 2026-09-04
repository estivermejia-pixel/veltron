import React, { useState } from 'react';

export default function PaymentPanel({ amount, veltrons, step, setStep, setTransactionCode }) {
  const [selectedMethod, setSelectedMethod] = useState(null); // 'wompi' or 'usdt'
  const [loading, setLoading] = useState(false);

  const isActive = step === 'PAYMENT' || step === 'PROCESSING';
  const isHidden = step === 'SUCCESS';

  const handleProcessTransaction = () => {
    setLoading(true);
    setStep('PROCESSING');

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
      
      // Generate random VTR code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'VTR-';
      for(let i=0; i<3; i++) {
          let segment = '';
          for(let j=0; j<4; j++) segment += chars.charAt(Math.floor(Math.random() * chars.length));
          code += segment + (i < 2 ? '-' : '');
      }
      setTransactionCode(code);
    }, 2000);
  };

  if (isHidden) return null; // Or keep it and apply classes, but code.html hides it in SUCCESS via 'hidden'. Actually code.html uses 'opacity-0 scale-95' then 'hidden'. Let's match logic.

  return (
    <div className={`lg:col-span-4 glass-card p-8 rounded-3xl island-transition ${!isActive ? 'opacity-50 pointer-events-none' : 'ring-2 ring-primary shadow-2xl'} ${step === 'PROCESSING' ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">payments</span>
        <h3 className="font-headline-md text-headline-md">Método de Pago</h3>
      </div>
      
      <div className="space-y-4">
        {/* Bancolombia Option */}
        <div 
          onClick={() => setSelectedMethod('wompi')}
          className={`payment-option p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group cursor-pointer
            ${selectedMethod === 'wompi' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 bg-white/40 hover:border-primary/50'}
          `}
        >
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-outline-variant/10 p-2">
            {/* Minimalist representation of Bancolombia */}
            <div className="w-6 h-6 flex flex-col justify-between">
              <div className="h-1.5 w-full bg-[#FFE500]"></div>
              <div className="h-1.5 w-full bg-[#0038A8]"></div>
              <div className="h-1.5 w-full bg-[#CE1126]"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-label-md text-label-md">Bancolombia</p>
            <p className="text-label-sm text-on-surface-variant">Instantáneo vía Wompi</p>
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-outline-variant/40 flex items-center justify-center">
            <div className={`w-3 h-3 bg-primary rounded-full transition-opacity ${selectedMethod === 'wompi' ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>

        {/* USDT Option */}
        <div 
          onClick={() => setSelectedMethod('usdt')}
          className={`payment-option p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group cursor-pointer
            ${selectedMethod === 'usdt' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 bg-white/40 hover:border-primary/50'}
          `}
        >
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-outline-variant/10">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>
          </div>
          <div className="flex-1">
            <p className="font-label-md text-label-md">USDT (TRC-20)</p>
            <p className="text-label-sm text-on-surface-variant">Moneda Estable Global</p>
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-outline-variant/40 flex items-center justify-center">
            <div className={`w-3 h-3 bg-primary rounded-full transition-opacity ${selectedMethod === 'usdt' ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>

        {/* Confirm Box */}
        {selectedMethod && (
          <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <button 
              onClick={handleProcessTransaction}
              disabled={loading}
              className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-2xl font-headline-md text-headline-md hover:brightness-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Procesando...
                </>
              ) : (
                'Completar Compra'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
