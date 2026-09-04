import React from 'react';
import { Calculator, ArrowRight, DollarSign } from 'lucide-react';

export default function CalculatorIsland({ amount, setAmount, currency, setCurrency, veltrons, onProceed }) {
  const isUSDT = currency === 'USDT';
  const isValid = amount && parseFloat(amount) > 0 && !(isUSDT && parseFloat(amount) < 1);

  return (
    <div className="glass-panel">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Cotizador</h2>
      </div>

      <div className="space-y-5">
        {/* Currency Selector */}
        <div className="flex bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => { setCurrency('COP'); setAmount(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              !isUSDT ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fiat (COP)
          </button>
          <button
            onClick={() => { setCurrency('USDT'); setAmount(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              isUSDT ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cripto (USDT)
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Monto a invertir
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-400 sm:text-sm">{currency}</span>
            </div>
          </div>
          {isUSDT && parseFloat(amount) < 1 && amount && (
            <p className="mt-2 text-sm text-red-400">El mínimo es 1 USDT.</p>
          )}
        </div>

        {/* Result Display */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
          <p className="text-sm text-slate-400 mb-1">Recibirás aproximadamente</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">
              {veltrons > 0 ? veltrons.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
            </span>
            <span className="text-blue-400 font-semibold">VTR</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onProceed}
          disabled={!isValid}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all
            ${isValid ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900' : 'bg-slate-700 cursor-not-allowed opacity-50'}
          `}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
