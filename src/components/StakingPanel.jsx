import React, { useState } from 'react';

export default function StakingPanel() {
  const [stakeAmount, setStakeAmount] = useState('10.000');
  const [days, setDays] = useState(180);

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Solo dígitos
    setStakeAmount(rawVal ? Number(rawVal).toLocaleString('es-CO') : '');
  };

  // Tasas de interés conservadoras y realistas (APR)
  const getApr = (selectedDays) => {
    switch (selectedDays) {
      case 30: return 10;
      case 90: return 12;
      case 180: return 15;
      case 365: return 18;
      default: return 15;
    }
  };

  const apr = getApr(days);
  const vtrAmount = parseFloat(stakeAmount.replace(/\./g, '')) || 0;
  
  // Cálculo de rendimiento: (Monto * APR * Días) / (365 * 100)
  const rawReward = (vtrAmount * (apr / 100) * days) / 365;
  const estimatedReward = Math.round(rawReward);
  const copEquivalent = estimatedReward * 1000;
  const totalBalance = vtrAmount + estimatedReward;

  return (
    <div className="glass-card p-8 rounded-3xl island-transition w-full mt-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
        <div>
          <h3 className="font-headline-md text-headline-md">Simulador de Retorno Pasivo</h3>
          <p className="text-label-sm text-on-surface-variant">Obtén rendimientos estables manteniendo tus tokens VTR a plazo fijo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna Izquierda: Controles */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Tokens VTR a Mantener</label>
            <div className="relative group">
              <input 
                type="text" 
                className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl px-4 py-4 font-headline-md text-headline-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                placeholder="0" 
                value={stakeAmount}
                onChange={handleInputChange}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">
                <span className="font-label-md text-primary">VTR</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Plazo de Retención</label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 90, 180, 365].map((period) => (
                <button
                  key={period}
                  onClick={() => setDays(period)}
                  className={`py-3 px-1 rounded-xl text-center font-label-md transition-all border cursor-pointer
                    ${days === period 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-white/40 border-outline-variant/20 text-on-surface-variant hover:border-primary/50'
                    }
                  `}
                >
                  {period} días
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low/30 p-4 rounded-2xl border border-white/20 flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Tasa Anual Proyectada (APR):</span>
            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
              {apr}% APR
            </span>
          </div>
        </div>

        {/* Columna Derecha: Resultados */}
        <div className="bg-white/30 rounded-2xl p-6 border border-white/50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Proyección de Retorno
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 p-4 rounded-xl border border-outline-variant/10">
                <p className="text-label-sm text-on-surface-variant mb-1">Retorno Estimado</p>
                <p className="text-headline-md font-bold text-primary">
                  +{estimatedReward.toLocaleString('es-CO')} VTR
                </p>
              </div>

              <div className="bg-white/40 p-4 rounded-xl border border-outline-variant/10">
                <p className="text-label-sm text-on-surface-variant mb-1">Equivalente COP</p>
                <p className="text-headline-md font-bold text-secondary">
                  +${copEquivalent.toLocaleString('es-CO')} COP
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/20 my-4"></div>

            <div className="flex justify-between items-center px-2">
              <div>
                <p className="text-label-sm text-on-surface-variant">Balance Total Proyectado</p>
                <p className="text-xs text-outline italic">* Sujeto a finalización del periodo</p>
              </div>
              <div className="text-right">
                <p className="text-headline-lg font-bold text-on-surface">
                  {totalBalance.toLocaleString('es-CO')} VTR
                </p>
                <p className="text-label-sm text-on-surface-variant uppercase">
                  ${(totalBalance * 1000).toLocaleString('es-CO')} COP
                </p>
              </div>
            </div>
          </div>

          <button 
            disabled={vtrAmount <= 0}
            className="w-full primary-gradient-btn py-4 rounded-2xl text-white font-headline-md text-headline-md shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Iniciar Staking de VTR
          </button>
        </div>
      </div>
    </div>
  );
}
