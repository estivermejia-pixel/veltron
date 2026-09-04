import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white text-slate-500 text-xs shrink-0 mt-12">
      {/* Grid Principal de 4 Columnas */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Columna 1: Marca & Descripción */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-[#111827]">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white font-black text-sm flex items-center justify-center">
                V
              </div>
              <span className="font-black text-sm sm:text-base text-[#111827] tracking-tight">
                Veltron Capital
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xs">
              Productos digitales semanales con pago libre por llave Bre-B.
            </p>
          </div>

          {/* Columna 2: PRODUCTO */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#111827]">
              PRODUCTO
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <a href="#catalogo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#111827] transition-colors">
                  Comprar
                </a>
              </li>
              <li>
                <Link to="/estado" className="hover:text-[#111827] transition-colors">
                  Mi orden
                </Link>
              </li>
              <li>
                <a href="#semana" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#111827] transition-colors">
                  Producto de la semana
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: LEGAL */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#111827]">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <Link to="/terminos" className="hover:text-[#111827] transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-[#111827] transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/reembolso" className="hover:text-[#111827] transition-colors">
                  Política de reembolso
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: CONTACTO */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#111827]">
              CONTACTO
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li>
                <a href="mailto:soporte@veltroncapital.co" className="hover:text-[#111827] transition-colors">
                  soporte@veltroncapital.co
                </a>
              </li>
              <li>
                <span className="text-slate-400">
                  WhatsApp: pendiente
                </span>
              </li>
              <li>
                <span>
                  Bogotá, Colombia
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

