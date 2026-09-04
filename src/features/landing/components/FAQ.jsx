import React from 'react';
import { FAQS_DATA } from '../data/faqs';
import { Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../../../common/motion/variants';

export default function FAQ() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? {} : fadeUp;

  return (
    <section className="py-8 sm:py-12">
      {/* Cabecera */}
      <div className="mb-8">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
          PREGUNTAS FRECUENTES
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight leading-tight">
          Todo lo que suelen preguntar.
        </h2>
      </div>

      {/* Contenedor Unificado de Acordeón */}
      <motion.div
        className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {FAQS_DATA.map((faq, idx) => (
          <details
            key={idx}
            className="group transition-colors open:bg-slate-50/30"
          >
            <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none text-xs sm:text-sm font-bold text-[#111827] hover:bg-slate-50/50 transition-colors">
              <span>{faq.question}</span>
              <Plus className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <div className="px-5 sm:px-6 pb-5 text-xs text-slate-500 font-medium leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </motion.div>
    </section>
  );
}

