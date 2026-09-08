import { getLenis } from './lenis';

interface ScrollTrigger {
  id: string;
  element: HTMLElement;
  start: string;
  end: string;
  onEnter: () => void;
  onLeave: () => void;
  onEnterBack: () => void;
  onLeaveBack: () => void;
  onUpdate: (progress: number) => void;
  triggered: boolean;
  triggeredBack: boolean;
}

const triggers: ScrollTrigger[] = [];
let observer: IntersectionObserver | null = null;
let scrollPosition = 0;
let viewportHeight = window.innerHeight;

export function initScrollTriggers(): void {
  viewportHeight = window.innerHeight;
  
  // Update viewport height on resize
  window.addEventListener('resize', () => {
    viewportHeight = window.innerHeight;
  }, { passive: true });
  
  // Use Lenis scroll event if available
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  
  // Initial check
  requestAnimationFrame(checkTriggers);
}

function onScroll(e: { scroll: number; direction: number } | Event): void {
  const scroll = 'scroll' in e ? e.scroll : window.scrollY;
  scrollPosition = scroll;
  checkTriggers();
}

function checkTriggers(): void {
  triggers.forEach(trigger => {
    const rect = trigger.element.getBoundingClientRect();
    const elementTop = rect.top + scrollPosition;
    const elementHeight = rect.height;
    
    // Parse start/end positions
    const startOffset = parsePosition(trigger.start, elementHeight);
    const endOffset = parsePosition(trigger.end, elementHeight);
    
    const start = elementTop - viewportHeight + startOffset;
    const end = elementTop + endOffset;
    
    const progress = Math.max(0, Math.min(1, (scrollPosition - start) / (end - start)));
    const isInView = scrollPosition >= start && scrollPosition <= end;
    const wasInView = trigger.triggered;
    
    if (isInView && !wasInView) {
      trigger.triggered = true;
      trigger.onEnter();
    } else if (!isInView && wasInView) {
      if (scrollPosition < start) {
        trigger.onLeaveBack();
      } else {
        trigger.onLeave();
      }
      trigger.triggered = false;
    }
    
    if (isInView) {
      trigger.onUpdate(progress);
    }
  });
}

function parsePosition(position: string, elementHeight: number): number {
  // Format: "top bottom", "center center", "100px", "50%", etc.
  const parts = position.split(' ');
  const reference = parts[0] || 'top';
  const viewport = parts[1] || 'bottom';
  
  let refValue = 0;
  let viewValue = 0;
  
  switch (reference) {
    case 'top': refValue = 0; break;
    case 'center': refValue = elementHeight / 2; break;
    case 'bottom': refValue = elementHeight; break;
    default: refValue = parseFloat(reference) || 0;
  }
  
  switch (viewport) {
    case 'top': viewValue = 0; break;
    case 'center': viewValue = viewportHeight / 2; break;
    case 'bottom': viewValue = viewportHeight; break;
    default: viewValue = parseFloat(viewport) || 0;
  }
  
  return viewValue - refValue;
}

export function createScrollTrigger(config: {
  id: string;
  element: HTMLElement;
  start?: string;
  end?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (progress: number) => void;
}): () => void {
  const trigger: ScrollTrigger = {
    id: config.id,
    element: config.element,
    start: config.start || 'top bottom',
    end: config.end || 'bottom top',
    onEnter: config.onEnter || (() => {}),
    onLeave: config.onLeave || (() => {}),
    onEnterBack: config.onEnterBack || (() => {}),
    onLeaveBack: config.onLeaveBack || (() => {}),
    onUpdate: config.onUpdate || (() => {}),
    triggered: false,
    triggeredBack: false,
  };
  
  triggers.push(trigger);
  
  // Return cleanup function
  return () => {
    const index = triggers.findIndex(t => t.id === config.id);
    if (index !== -1) {
      triggers.splice(index, 1);
    }
  };
}

export function removeScrollTrigger(id: string): void {
  const index = triggers.findIndex(t => t.id === id);
  if (index !== -1) {
    triggers.splice(index, 1);
  }
}

export function getScrollPosition(): number {
  return scrollPosition;
}

export function getViewportHeight(): number {
  return viewportHeight;
}

// Batch trigger creation for performance
export function batchScrollTriggers(configs: Parameters<typeof createScrollTrigger>[0][]): () => void {
  const cleanups = configs.map(createScrollTrigger);
  return () => cleanups.forEach(cleanup => cleanup());
}