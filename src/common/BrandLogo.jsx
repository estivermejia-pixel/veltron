import React from 'react';

export default function BrandLogo({ size = "md", showText = true }) {
  const dimensions = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className="flex items-center gap-3 group">
      {/* Isotipo: V de Veltron Capital en color Negro + Arcos de color al pie */}
      <div className={`relative ${dimensions} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
        >
          {/* Arcos de color en el pie (Amarillo, Naranja, Morado) */}
          <path
            d="M 14,78 A 42,42 0 0,0 58,94"
            stroke="#FFD53D"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10,64 A 42,42 0 0,0 28,84"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 32,88 A 42,42 0 0,0 46,94"
            stroke="#1E3A8A"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Isotipo: Letra "V" en color Negro (#2C2C2C) */}
          <path
            d="M 26,16 L 48,64 L 70,16"
            stroke="#2C2C2C"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#2C2C2C] tracking-tight text-xl leading-none">
              Veltron Capital
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-0.5">
            Productos Digitales
          </span>
        </div>
      )}
    </div>
  );
}
