import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  lenisInstance = new Lenis({
    duration: prefersReducedMotion ? 0 : 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  } as any);
  
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  // Expose for debugging
  (window as any).__lenis = lenisInstance;
  
  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number; easing?: (t: number) => number }): void {
  lenisInstance?.scrollTo(target, options);
}

export function stopScroll(): void {
  lenisInstance?.stop();
}

export function startScroll(): void {
  lenisInstance?.start();
}

export function onScroll(callback: (e: { scroll: number; direction: number; velocity: number }) => void): () => void {
  if (!lenisInstance) return () => {};
  lenisInstance.on('scroll', callback);
  return () => lenisInstance?.off('scroll', callback);
}