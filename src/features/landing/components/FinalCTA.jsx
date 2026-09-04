import React from 'react';
import { Upload } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { scaleIn } from '../../../common/motion/variants';

export default function FinalCTA({ onOpenCheckout }) {
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof onOpenCheckout === 'function') {
      setTimeout(() => {
        onOpenCheckout();
      }, 350);
    }
  };

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
            Escanea, paga lo que gustes y sube tu comprobante. Disponible hasta el domingo.
          </p>

          {/* Botón Subir Comprobante */}
          <div>
            <button
              onClick={handleScrollToTop}
              className="py-3.5 px-7 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#111827] stroke-[2.5]" />
              Subir Comprobante
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

