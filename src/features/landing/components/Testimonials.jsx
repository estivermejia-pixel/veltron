import React from 'react';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../../../common/motion/variants';

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? {} : staggerContainer(0.08);
  const cardVariants = shouldReduceMotion ? {} : fadeUp;

  return (
    <section className="py-8 sm:py-12">
      {/* Cabecera */}
      <div className="mb-8">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
          LO QUE DICEN
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight leading-tight">
          Compradores reales, entregas reales.
        </h2>
      </div>

      {/* Grid de Testimonios */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {TESTIMONIALS_DATA.map((t, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md"
          >
            <div>
              {/* Estrellas azules */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#1D4ED8] text-[#1D4ED8]" />
                ))}
              </div>

              {/* Cita */}
              <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed mb-6">
                {t.quote}
              </p>
            </div>

            {/* Separador y Autor */}
            <div className="border-t border-slate-100 pt-4 mt-auto">
              <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
                {t.name}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400 font-normal mt-0.5">
                {t.role}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

