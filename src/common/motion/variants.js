/**
 * Standard motion variants for Veltron Capital.
 * Optimized for 60fps GPU acceleration (only transforms and opacity).
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut'
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const staggerContainer = (staggerDelay = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
});

export const cardHover = {
  rest: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
};
