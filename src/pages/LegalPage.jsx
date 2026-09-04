import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { LEGAL_DATA } from '../features/landing/data/legalData';
import SEOHead from '../components/SEOHead';
import { ArrowLeft, Shield, FileText, RefreshCw, Mail } from 'lucide-react';

import { motion, useReducedMotion } from 'framer-motion';

export default function LegalPage() {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Detect active tab from pathname or param
  const getInitialTab = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('privacidad')) return 'privacidad';
    if (path.includes('reembolso')) return 'reembolso';
    if (path.includes('terminos')) return 'terminos';
    if (section && LEGAL_DATA[section]) return section;
    return 'terminos';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, section]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/${key}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentDoc = LEGAL_DATA[activeTab] || LEGAL_DATA.terminos;

  const tabIcons = {
    terminos: FileText,
    privacidad: Shield,
    reembolso: RefreshCw
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEOHead
        title={`${currentDoc.title} | Veltron Capital`}
        description={currentDoc.description}
        path={`/${activeTab}`}
      />

      {/* Botón Volver */}

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#111827] transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al catálogo
        </Link>
      </div>

      {/* Cabecera Principal */}
      <div className="space-y-3">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 block">
          CENTRO LEGAL & TRANSPARENCIA
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight leading-tight">
          {currentDoc.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
          {currentDoc.description}
        </p>
        <div className="pt-1 text-[11px] text-slate-400 font-medium">
          Última actualización: <span className="font-semibold text-slate-600">{currentDoc.lastUpdated}</span> • República de Colombia
        </div>
      </div>

      {/* Selector de Pestañas (Tabs) */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200/80 pb-4">
        {[
          { key: 'terminos', label: 'Términos y condiciones' },
          { key: 'privacidad', label: 'Política de privacidad' },
          { key: 'reembolso', label: 'Política de reembolso' }
        ].map((tab) => {
          const Icon = tabIcons[tab.key];
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-2.5 px-4 sm:px-5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                isActive
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-[#111827] border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenedor del Documento Legal */}
      <motion.div
        key={activeTab}
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white rounded-3xl sm:rounded-[32px] border border-slate-100 p-8 sm:p-12 shadow-sm space-y-10 divide-y divide-slate-100"
      >
        {currentDoc.sections.map((sec, idx) => (
          <div key={idx} className={idx === 0 ? '' : 'pt-8'}>
            <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight mb-3">
              {sec.heading}
            </h2>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed">
              {sec.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recuadro de Contacto y Dudas Legales */}
      <div className="bg-[#F8F9FA] rounded-[24px] border border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
            ¿Tiene alguna inquietud sobre nuestras políticas?
          </h4>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Nuestro equipo de cumplimiento y soporte atenderá su solicitud formal en menos de 48 horas.
          </p>
        </div>
        <a
          href="mailto:soporte@veltroncapital.co"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#111827] hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
        >
          <Mail className="w-3.5 h-3.5 text-slate-500" />
          soporte@veltroncapital.co
        </a>
      </div>

    </div>
  );
}
