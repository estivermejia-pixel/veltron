import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

export default function MouseInteraction({ children, className = '', tiltIntensity = 12 }) {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Física de resortes (Spring physics lerping) para movimiento cinematográfico suave
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

  // Destello de brillo de luz reflexiva (Sheen highlight position)
  const sheenX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']), springConfig);
  const sheenY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']), springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseClientX = e.clientX - rect.left;
    const mouseClientY = e.clientY - rect.top;

    const xPct = mouseClientX / width - 0.5;
    const yPct = mouseClientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      className={`relative group ${className}`}
    >
      {/* Capa de destello de luz reflexiva ambiental */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
        style={{
          background: `radial-gradient(800px circle at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.18), transparent 40%)`,
        }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
}
