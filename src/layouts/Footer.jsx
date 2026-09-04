import React from 'react';
import BrandLogo from '../common/BrandLogo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 bg-white py-2.5 text-slate-400 text-[11px] font-medium shrink-0">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2025 Veltron Capital. Todos los derechos reservados.</p>
        <p>Pagos protegidos con Bre-B & Red Bancaria</p>
      </div>
    </footer>
  );
}
