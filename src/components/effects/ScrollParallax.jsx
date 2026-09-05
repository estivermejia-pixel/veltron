import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

export default function ScrollParallax({ children, speed = 0.2, className = '', scaleEffect = false, blurEffect = false }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const springConfig = { damping: 25, stiffness: 100 };
  
  // Parallax Y offset
  const rawY = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  const y = useSpring(rawY, springConfig);

  // Efectos opcionales de profundidad (escala y desenfoque cinematográfico)
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);
  const scale = useSpring(rawScale, springConfig);

  const rawBlur = useTransform(scrollYProgress, [0, 0.5, 1], ['6px', '0px', '4px']);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      style={{
        y,
        ...(scaleEffect ? { scale } : {}),
        ...(blurEffect ? { filter: `blur(${rawBlur})` } : {}),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
