import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = direction === 'up' ? 30 : direction === 'left' ? -30 : direction === 'right' ? 30 : -30;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === 'up' || direction === 'down' ? offset : 0,
        x: direction === 'left' || direction === 'right' ? offset : 0,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1], // transiciones cinematográficas inspiradas en Kage
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
