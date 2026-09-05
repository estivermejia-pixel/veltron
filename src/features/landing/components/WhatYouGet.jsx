import React from 'react';
import { BENEFITS_DATA } from '../data/benefits';
import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '../../../common/motion/variants';

export default function WhatYouGet() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12
          }
        }
      };

  const leftVariants = shouldReduceMotion ? {} : fadeUp;
  const rightVariants = shouldReduceMotion ? {} : scaleIn;

  return (
    <section className="py-8 sm:py-12">
      <motion.div
        className="bg-white rounded-3xl sm:rounded-[32px] border border-slate-100 p-8 sm:p-10 lg:p-12 shadow-sm overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Qué recibes con tu pago */}
          <motion.div
            variants={leftVariants}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Pill badge */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                ESTA SEMANA
              </span>
            </div>

            {/* Titular */}
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#111827] tracking-tight leading-tight mb-2">
              Qué recibes con tu pago
            </h2>

            {/* Descripción */}
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mb-6 max-w-lg">
              Un paquete digital nuevo cada lunes: plantillas, guías y recursos listos para usar en tu negocio.
            </p>

            {/* Lista de beneficios con checks */}
            <div className="space-y-3 sm:space-y-3.5">
              {BENEFITS_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0" />
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Columna Derecha: Vista previa del producto (Imagen en miniatura) */}
          <motion.div
            variants={rightVariants}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <div className="w-full rounded-[24px] sm:rounded-[28px] border border-slate-200/90 bg-white shadow-xs overflow-hidden group">
              <img
                src="/excel_dashboard_preview.png"
                alt="Vista previa en miniatura del producto digital de la semana"
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}

