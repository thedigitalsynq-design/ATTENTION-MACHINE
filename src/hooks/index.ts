import { createScrollTrigger, getScrollPosition, getViewportHeight } from '../utils/scrollTriggers';

type ScrollProgressCallback = (progress: number) => void;

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
  onProgress?: ScrollProgressCallback;
}

export function useScrollProgress(element: HTMLElement, options: UseScrollProgressOptions = {}): {
  progress: number;
  isInView: boolean;
  destroy: () => void;
} {
  let progress = 0;
  let isInView = false;
  let cleanup: () => void;
  
  const { start = 'top bottom', end = 'bottom top', onProgress } = options;
  
  cleanup = createScrollTrigger({
    id: `scroll-progress-${Math.random().toString(36).slice(2)}`,
    element,
    start,
    end,
    onEnter: () => { isInView = true; },
    onLeave: () => { isInView = false; },
    onEnterBack: () => { isInView = true; },
    onLeaveBack: () => { isInView = false; },
    onUpdate: (p) => {
      progress = p;
      onProgress?.(p);
    },
  });
  
  return {
    get progress() { return progress; },
    get isInView() { return isInView; },
    destroy: cleanup,
  };
}

export function useScrollDirection(): { direction: 'up' | 'down'; velocity: number } {
  let lastScroll = getScrollPosition();
  let direction: 'up' | 'down' = 'down';
  let velocity = 0;
  
  // This would be updated by a scroll listener in a real implementation
  // For now, return a getter-based approach
  return {
    get direction() {
      const current = getScrollPosition();
      direction = current > lastScroll ? 'down' : 'up';
      lastScroll = current;
      return direction;
    },
    get velocity() {
      return velocity;
    },
  };
}

export function useViewportSize(): { width: number; height: number } {
  return {
    get width() { return window.innerWidth; },
    get height() { return getViewportHeight(); },
  };
}

export function useReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useIntersectionObserver(
  element: HTMLElement | null,
  options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null {
  let entry: IntersectionObserverEntry | null = null;
  
  if (!element) return null;
  
  const observer = new IntersectionObserver((entries) => {
    entry = entries[0];
  }, {
    rootMargin: '0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    ...options,
  });
  
  observer.observe(element);
  
  return entry;
}

export function useMediaQuery(query: string): boolean {
  const mediaQuery = window.matchMedia(query);
  return mediaQuery.matches;
}

export function useResizeObserver(element: HTMLElement | null): DOMRectReadOnly | null {
  let rect: DOMRectReadOnly | null = null;
  
  if (!element) return null;
  
  const observer = new ResizeObserver((entries) => {
    rect = entries[0].contentRect;
  });
  
  observer.observe(element);
  
  return rect;
}

// Animation frame loop hook
export function useAnimationFrame(callback: (time: number, delta: number) => void): () => void {
  let lastTime = 0;
  let frameId: number;
  
  function loop(time: number) {
    const delta = time - lastTime;
    lastTime = time;
    callback(time, delta);
    frameId = requestAnimationFrame(loop);
  }
  
  frameId = requestAnimationFrame(loop);
  
  return () => cancelAnimationFrame(frameId);
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  // Simplified - in real implementation would use state
  return value;
}

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  // Simplified - in real implementation would use state
  return value;
}