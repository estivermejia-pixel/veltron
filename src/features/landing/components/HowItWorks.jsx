import React from 'react';
import { STEPS_DATA } from '../data/steps';
import { QrCode, Wallet, Upload } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../../../common/motion/variants';

const ICONS_MAP = {
  QrCode,
  Wallet,
  Upload
};

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? {} : staggerContainer(0.08);
  const cardVariants = shouldReduceMotion ? {} : fadeUp;

  return (
    <section className="py-8 sm:py-12">
      {/* Encabezado alineado a la izquierda según referencia */}
      <div className="text-left mb-7 sm:mb-9">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-slate-400 block mb-1.5">
          CÓMO FUNCIONA
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-[#111827] tracking-tight leading-tight">
          Tres pasos, menos de cinco minutos.
        </h2>
      </div>

      {/* Grid de 3 Tarjetas réplica exacta */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {STEPS_DATA.map((step) => {
          const IconComponent = ICONS_MAP[step.icon] || QrCode;

          return (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={shouldReduceMotion ? {} : { y: -3, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}
              className="bg-white rounded-[26px] sm:rounded-[28px] p-6 sm:p-7 border border-slate-100 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all"
            >
              {/* Fila Superior: Círculo negro a la izquierda y número en gris claro a la derecha */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-xs">
                  <IconComponent className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <span className="text-2xl sm:text-[28px] font-black text-[#CBD5E1] tracking-tight select-none">
                  {step.number}
                </span>
              </div>

              {/* Contenido: Título en negrita y descripción en gris neutro */}
              <div className="mt-6 sm:mt-7 space-y-2">
                <h3 className="text-[15px] sm:text-base font-bold text-[#111827] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
