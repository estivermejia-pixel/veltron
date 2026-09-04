import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts, BANCOLOMBIA_LLAVE } from '../services/api';
import QRCodePaymentCard from '../features/catalog/components/QRCodePaymentCard';
import HowItWorks from '../features/landing/components/HowItWorks';
import WhatYouGet from '../features/landing/components/WhatYouGet';
import Testimonials from '../features/landing/components/Testimonials';
import FAQ from '../features/landing/components/FAQ';
import FinalCTA from '../features/landing/components/FinalCTA';
import { Sparkles, Check, Clock, Wallet, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SEOHead from '../components/SEOHead';


export default function CatalogPage() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prodsData = await getActiveProducts();
        setProducts(prodsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeProduct = products[0];

  const handlePayWompi = () => {
    navigate(`/comprar/${activeProduct?.id || '1'}`);
  };

  const shouldReduceMotion = useReducedMotion();

  // Variantes de animación de entrada
  const fadeUp = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

  const fadeLeft = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

  // Stagger para las 3 columnas
  const colVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const colItem = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } } };

  return (
    <div className="w-full max-w-[1400px] mx-auto pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-4 sm:pr-6 md:pr-8 lg:pr-10 pt-2 sm:pt-4 pb-6 space-y-4 sm:space-y-5">
      <SEOHead
        title="Veltron Capital | Productos Digitales con Pago Libre"
        description="Descarga productos digitales exclusivos con aporte libre verificados por Llave Bancolombia Negocios y Wompi en Veltron Capital."
        path="/"
      />

      {/* Encabezado Principal */}

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Paga lo que gustes. Descarga en minutos.
        </h1>
      </div>

      {/* BLOQUE PRINCIPAL — mobile: QR primero, tarjeta segunda / desktop: QR izq (col-5), tarjeta der (col-7) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">

        {/* QR — order-1 en mobile, order-1 en desktop */}
        <motion.div
          className="order-1 md:order-1 md:col-span-5 flex flex-col justify-between items-center md:items-start"
          {...fadeLeft}
        >
          <QRCodePaymentCard llave={BANCOLOMBIA_LLAVE} onPayWompi={handlePayWompi} />
        </motion.div>

        {/* TARJETA DERECHA — order-2 en mobile, order-2 en desktop */}
        <motion.div
          className="order-2 md:order-2 md:col-span-7 bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden flex flex-col"
          {...fadeUp}
        >

          {/* ENCABEZADO DE TARJETA CON DEGRADADO SUAVE */}
          <div className="px-6 sm:px-8 pt-5 pb-3.5" style={{ background: 'linear-gradient(to right, #FEFCE8 0%, #FFFFFF 65%)' }}>
            <h2 className="text-[20px] sm:text-[23px] md:text-[25px] font-black text-[#111827] leading-[1.15] tracking-tight">
              Escanea con tu banco o paga online.<br />
              Acceso digital inmediato.
            </h2>
          </div>

          {/* CUERPO */}
          <div className="px-6 sm:px-8 pb-5 pt-1 space-y-4 flex flex-col">

            {/* TARJETA INTERNA: MONTO A PAGAR con hover lift */}
            <motion.div
              className="bg-[#F8F9FA] border border-slate-200 rounded-2xl px-5 py-3.5 space-y-2.5 cursor-default"
              whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                MONTO A PAGAR
              </span>
              {/* Monto Libre — responsive: 24px mobile → 36px desktop */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[24px] sm:text-[28px] md:text-[32px] font-black text-[#111827] leading-none tracking-tight">
                  Monto Libre
                </span>
                <span className="text-[11px] font-semibold text-slate-400 leading-none">
                  Aporte Voluntario
                </span>
              </div>
              <hr className="border-slate-200/80" />
              {/* 3 columnas con stagger */}
              <motion.div
                className="grid grid-cols-3 gap-2"
                variants={colVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">ENTIDAD</span>
                  <span className="text-[12px] font-bold text-[#111827]">Veltron Capital</span>
                </motion.div>
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">LLAVE / MEDIO</span>
                  <span className="text-[12px] font-bold text-[#111827]">@veltroncapital</span>
                </motion.div>
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">COMISIÓN</span>
                  <span className="text-[12px] font-black text-emerald-600">$0 COP</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* SECCIÓN PRODUCTO con hover scale */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                PRODUCTO DIGITAL INCLUIDO CON TU PAGO
              </span>

              {loading ? (
                <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
              ) : (
                <motion.div
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 cursor-default"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01, borderColor: '#c7d2fe' }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <Sparkles style={{ width: '17px', height: '17px' }} className="text-[#4F46E5]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block">
                        PRODUCTO DE LA SEMANA
                      </span>
                      <span className="text-[13px] font-semibold text-[#111827] block truncate">
                        {activeProduct?.titulo || 'Producto Digital de la Semana'}
                      </span>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-emerald-500 stroke-[2.5] shrink-0" />
                </motion.div>
              )}
            </div>

            {/* PIE DE TARJETA DERECHA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                <Clock className="w-4 h-4 text-amber-500" />
                Disponible esta semana
              </span>
            </div>

          </div>
        </motion.div>

      </section>

      {/* SECCIONES COMPLEMENTARIAS DE LA LANDING */}
      <HowItWorks />
      <WhatYouGet />
      <Testimonials />
      <FAQ />
      <FinalCTA onPayWompi={handlePayWompi} />

    </div>
  );
}

