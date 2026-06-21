import React from 'react';

export default function StatusPanel({ step, transactionCode, onReset }) {
  const isSuccess = step === 'SUCCESS';

  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Default Network Health Stats (Always present behind/replaced by Success logically in HTML, but here we can toggle them) */}
      {!isSuccess && (
        <div className="glass-card p-8 rounded-3xl h-full animate-in fade-in zoom-in duration-500">
          <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-6">Estado de la Red</h4>
          <div className="space-y-6">
            <div>
              <p className="text-label-sm font-label-sm text-outline mb-1">Volumen 24H</p>
              <p className="text-headline-lg font-headline-lg text-primary">$12.4M</p>
            </div>
            <div className="h-[1px] bg-outline-variant/20"></div>
            <div>
              <p className="text-label-sm font-label-sm text-outline mb-1">Valor Total Bloqueado (TVL)</p>
              <p className="text-headline-lg font-headline-lg text-secondary">$842.1M</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Island overlaying/replacing stats */}
      {isSuccess && (
        <div className="glass-card p-8 rounded-3xl bg-primary-container/10 border-primary/30 h-full flex flex-col justify-center animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-[0_0_20px_rgba(0,97,165,0.4)]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2">Compra Exitosa</h3>
            <p className="text-body-md text-on-surface-variant mb-6">Tus tokens VTR han sido asignados a tu billetera.</p>
            
            <div className="bg-white/60 p-4 rounded-2xl border border-dashed border-primary/40 mb-6 relative group overflow-hidden">
              <p className="text-label-sm font-label-sm text-outline mb-1">REFERENCIA DE TX</p>
              <p className="font-mono text-primary font-bold">{transactionCode}</p>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(transactionCode);
                  // Optional: add a tiny toast or text feedback
                }}
                className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
                title="Copiar al portapapeles"
              >
                <span className="material-symbols-outlined text-primary">content_copy</span>
              </button>
            </div>
            
            <button 
              onClick={onReset}
              className="text-primary font-label-md text-label-md hover:underline decoration-2 underline-offset-4"
            >
              Iniciar Nueva Transacción
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
