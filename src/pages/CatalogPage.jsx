import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts, BANCOLOMBIA_LLAVE } from '../services/api';
import QRCodePaymentCard from '../features/catalog/components/QRCodePaymentCard';
import HowItWorks from '../features/landing/components/HowItWorks';
import WhatYouGet from '../features/landing/components/WhatYouGet';
import Testimonials from '../features/landing/components/Testimonials';
import FAQ from '../features/landing/components/FAQ';
import FinalCTA from '../features/landing/components/FinalCTA';
import { Sparkles, Check, Clock, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SEOHead from '../components/SEOHead';

// Efectos de movimiento 3D e interacción inspirados técnicamente en Kage
import MouseInteraction from '../components/effects/MouseInteraction';
import ScrollParallax from '../components/effects/ScrollParallax';
import AnimatedSection from '../components/effects/AnimatedSection';


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
    <div className="w-full relative min-h-screen overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-4 sm:pr-6 md:pr-8 lg:pr-10 pt-2 sm:pt-4 pb-6 space-y-8 relative z-10">
        <SEOHead
          title="Veltron Capital | Productos Digitales con Pago Libre"
          description="Descarga productos digitales exclusivos con aporte libre verificados por Llave Bancolombia Negocios y Wompi en Veltron Capital."
          path="/"
        />
        
        {/* Encabezado Principal */}
        <AnimatedSection direction="down">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[19px] xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight whitespace-nowrap">
              Paga lo que gustes. Descarga en minutos.
            </h1>
          </div>
        </AnimatedSection>

        {/* BLOQUE PRINCIPAL CON EFECTO DE INTERACCIÓN 3D (TILT) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
          
          {/* QR Card sin efectos de inclinación */}
          <motion.div
            className="order-1 md:order-1 md:col-span-5 flex flex-col justify-between items-center md:items-start w-full"
            {...fadeLeft}
          >
            <QRCodePaymentCard llave={BANCOLOMBIA_LLAVE} onPayWompi={handlePayWompi} />
          </motion.div>

          {/* TARJETA DERECHA sin efectos de inclinación */}
          <motion.div
            className="order-2 md:order-2 md:col-span-7"
            {...fadeUp}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-[28px] shadow-lg border border-slate-100/90 overflow-hidden flex flex-col">

              {/* ENCABEZADO DE TARJETA CON DEGRADADO SUAVE */}
              <div className="px-6 sm:px-8 pt-5 pb-3.5" style={{ background: 'linear-gradient(to right, #FEFCE8 0%, #FFFFFF 65%)' }}>
                <h2 className="text-[20px] sm:text-[23px] md:text-[25px] font-black text-[#111827] leading-[1.15] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#4F46E5] shrink-0" />
                  <span>Producto Digital de la Semana</span>
                </h2>
              </div>

              {/* CUERPO: ESPACIO DE VISTA PREVIA DEL PRODUCTO */}
              <div className="px-6 sm:px-8 pb-6 pt-3 space-y-4 flex flex-col">
                {loading ? (
                  <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
                ) : (
                  <div className="bg-[#F8F9FA] border border-slate-200/90 rounded-2xl p-5 space-y-4">
                    
                    {/* Header de la Vista Previa */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black shadow-xs shrink-0 text-xs uppercase tracking-wider">
                          {activeProduct?.tipo === 'libro' ? 'PDF' : 'XLSX'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                            {activeProduct?.tipo === 'libro' ? 'Guía / Libro PDF' : 'Plantilla Excel Profesional'}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-[#111827] leading-snug truncate">
                            {activeProduct?.titulo || 'Excel Logistics & Inventory Management Pro'}
                          </h3>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                        <Check className="w-3 h-3" /> Incluido
                      </span>
                    </div>

                    {/* Simulación Gráfica de Hoja Excel / Vista Previa */}
                    <div className="bg-emerald-950/5 border border-emerald-500/20 rounded-xl p-3 flex flex-col space-y-2 font-mono text-[11px] overflow-hidden select-none">
                      <div className="flex items-center justify-between border-b border-emerald-900/10 pb-1.5 text-[10px] text-emerald-800 font-bold">
                        <span className="flex items-center gap-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          Logistics_Inventory_Dashboard.xlsx
                        </span>
                        <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                          Excel Dashboard Pro
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-slate-600 text-center">
                        <div className="bg-emerald-100/60 p-1 rounded font-bold text-emerald-900">SKU</div>
                        <div className="bg-emerald-100/60 p-1 rounded font-bold text-emerald-900">Stock</div>
                        <div className="bg-emerald-100/60 p-1 rounded font-bold text-emerald-900">Estado</div>
                        <div className="bg-emerald-100/60 p-1 rounded font-bold text-emerald-900">KPI</div>
                        
                        <div className="bg-white p-1 rounded border border-slate-100">LOG-849</div>
                        <div className="bg-white p-1 rounded border border-slate-100">1,240 u</div>
                        <div className="bg-emerald-50 text-emerald-700 p-1 rounded font-bold">OK</div>
                        <div className="bg-white p-1 rounded border border-slate-100 text-emerald-600 font-black">98.4%</div>
                      </div>
                    </div>

                    {/* Descripción del Producto Solicitada */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      {activeProduct?.descripcion || 'Contenido digital exclusivo de la semana listo para descarga inmediata con aporte o monto libre.'}
                    </p>

                  </div>
                )}
              </div>
              </div>
          </motion.div>

        </section>

        {/* SECCIONES COMPLEMENTARIAS CON PARALAJE Y TRANSICIONES CINEMATOGRÁFICAS */}
        <ScrollParallax speed={0.15} scaleEffect>
          <AnimatedSection delay={0.1}>
            <HowItWorks />
          </AnimatedSection>
        </ScrollParallax>

        <AnimatedSection delay={0.15}>
          <WhatYouGet />
        </AnimatedSection>

        <ScrollParallax speed={0.1}>
          <AnimatedSection delay={0.1}>
            <Testimonials />
          </AnimatedSection>
        </ScrollParallax>

        <AnimatedSection delay={0.15}>
          <FAQ />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <FinalCTA onPayWompi={handlePayWompi} />
        </AnimatedSection>

      </div>
    </div>
  );
}
