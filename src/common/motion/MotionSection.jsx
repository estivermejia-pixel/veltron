import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from './variants';

/**
 * Reusable motion wrapper for page sections.
 * Automatically respects system reduced-motion preferences and optimizes viewports.
 */
export default function MotionSection({
  children,
  className = '',
  variants = fadeUp,
  viewportMargin = '-50px',
  once = true,
  as = 'section',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as] || motion.section;

  if (shouldReduceMotion) {
    const Component = as;
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      variants={variants}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
