import React from 'react';
import { CheckCircle2, Copy, RefreshCcw } from 'lucide-react';

export default function SuccessIsland({ transactionCode, veltrons, onReset }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(transactionCode);
    alert("Código copiado al portapapeles");
  };

  return (
    <div className="glass-panel text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <CheckCircle2 className="w-20 h-20 text-green-400 relative z-10" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">¡Transacción Exitosa!</h2>
      <p className="text-slate-300 mb-6">
        Has adquirido <span className="font-semibold text-blue-400">{veltrons} VTR</span>.
      </p>

      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-8">
        <p className="text-sm text-slate-400 mb-2">Tu código temporal de registro es:</p>
        <div className="flex items-center justify-center space-x-3">
          <code className="text-2xl font-mono font-bold text-white tracking-wider">
            {transactionCode}
          </code>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Copiar código"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        <span>Realizar otra transacción</span>
      </button>
    </div>
  );
}
