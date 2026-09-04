import React from 'react';

export default function SkyElement({ element, isNightMode, onClick }) {
  const { x, y, created_at, dias_duracion, tipo_elemento, dedicado_a } = element;

  // Cálculo de vencimiento
  const createdAt = new Date(created_at);
  const expirationDate = new Date(createdAt.getTime() + dias_duracion * 24 * 60 * 60 * 1000);
  const isExpired = expirationDate < new Date();

  // Filtrar según el modo Día/Noche
  if (isNightMode && tipo_elemento === 'nube') return null;
  if (!isNightMode && tipo_elemento === 'estrella') return null;

  // Ajuste dinámico de coordenadas en caso de vencimiento
  const displayX = Number(x);
  const displayY = isExpired ? Number(y) + 2000 : Number(y);

  return (
    <div 
      onClick={() => onClick(element)}
      style={{
        position: 'absolute',
        left: `${displayX}px`,
        top: `${displayY}px`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`group cursor-pointer select-none transition-opacity duration-500 z-10 ${isExpired ? 'opacity-30' : 'opacity-100'}`}
    >
      {/* Elemento Visual */}
      {tipo_elemento === 'nube' ? (
        // Renderizado de Nube de Día
        <div className={`relative flex items-center justify-center ${!isExpired ? 'animate-bounce' : ''}`} style={{ animationDuration: '6s' }}>
          <svg 
            className="w-16 h-10 text-white/80 filter drop-shadow-[0_4px_6px_rgba(255,255,255,0.4)]" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>
      ) : (
        // Renderizado de Estrella de Noche
        <div className="relative flex items-center justify-center">
          {/* Brillo exterior (glow) */}
          {!isExpired && (
            <div className="absolute w-8 h-8 rounded-full bg-blue-400/40 blur-md animate-pulse"></div>
          )}
          {/* Núcleo de la estrella */}
          <div 
            className={`w-3.5 h-3.5 bg-white rounded-full border border-blue-100 shadow-[0_0_8px_4px_rgba(255,255,255,0.8)]
              ${!isExpired ? 'animate-pulse' : ''}
            `}
            style={{ animationDuration: '1.5s' }}
          ></div>
        </div>
      )}

      {/* Tooltip con información en Hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-950/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">
        <p className="font-semibold text-center">{dedicado_a}</p>
        {isExpired && <p className="text-[10px] text-slate-400 text-center">(Histórico)</p>}
      </div>
    </div>
  );
}
