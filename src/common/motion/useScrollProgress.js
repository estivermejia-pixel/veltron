import { useState, useEffect } from 'react';

/**
 * Hook to track directional scroll and progress.
 * Optimized with passive listeners and requestAnimationFrame.
 */
export function useScrollProgress(threshold = 24) {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollProgress: 0,
    scrollDirection: 'none', // 'up' | 'down' | 'none'
    isScrolled: false,
    isHeaderVisible: true
  });

  useEffect(() => {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / scrollHeight)) : 0;

      const diff = currentScrollY - lastScrollY;
      const isDown = diff > 4;
      const isUp = diff < -4;

      let newDirection = 'none';
      let headerVisible = true;

      if (currentScrollY <= threshold) {
        // Al inicio de la página siempre visible
        headerVisible = true;
        newDirection = 'none';
      } else if (isDown) {
        // Al bajar ocultar
        headerVisible = false;
        newDirection = 'down';
      } else if (isUp) {
        // Al subir reaparecer
        headerVisible = true;
        newDirection = 'up';
      }

      setScrollState(prev => {
        // Evitar renders innecesarios si la visibilidad y estado básico no cambian
        const isScrolledNow = currentScrollY > threshold;
        const targetHeaderVisible = currentScrollY <= threshold ? true : (isDown ? false : (isUp ? true : prev.isHeaderVisible));

        return {
          scrollY: currentScrollY,
          scrollProgress: progress,
          scrollDirection: newDirection !== 'none' ? newDirection : prev.scrollDirection,
          isScrolled: isScrolledNow,
          isHeaderVisible: targetHeaderVisible
        };
      });

      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrollState;
}
