import React from 'react';
import { Wallet } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { scaleIn } from '../../../common/motion/variants';

export default function FinalCTA({ onPayWompi }) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? {} : scaleIn;

  return (
    <section className="py-8 sm:py-12">
      <motion.div
        className="bg-[#0B0F19] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 text-center shadow-lg"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Titular */}
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-tight mb-3">
            Listo para descargar el producto de esta semana
          </h2>

          {/* Subtítulo */}
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-8">
            Paga online con Wompi o escanea el QR con tu app bancaria para acceso inmediato.
          </p>

          {/* Botón Pagar con Wompi */}
          <div>
            <button
              onClick={onPayWompi}
              className="py-3.5 px-8 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Pagar con</span>
              <img src="/wompi-logo.png" alt="Wompi" className="h-4.5 object-contain shrink-0" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}


