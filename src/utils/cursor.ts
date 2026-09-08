interface CursorElements {
  dot: HTMLDivElement;
  ring: HTMLDivElement;
}

let cursorElements: CursorElements | null = null;
let mousePosition = { x: 0, y: 0 };
let currentPosition = { x: 0, y: 0 };
let isVisible = false;
let isHovering = false;
let animationFrame: number | null = null;
let prefersReducedMotion = false;

export function initCursor(): void {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) return;
  
  // Check if touch device
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;
  
  createCursorElements();
  bindEvents();
  startAnimationLoop();
}

function createCursorElements(): void {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  
  cursorElements = { dot, ring };
}

function bindEvents(): void {
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseenter', onMouseEnter);
  document.addEventListener('mouseleave', onMouseLeave);
  
  // Track hoverable elements
  document.addEventListener('mouseover', onMouseOver, true);
  document.addEventListener('mouseout', onMouseOut, true);
  
  // Handle click effect
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  
  // Handle scroll
  window.addEventListener('scroll', onScroll, { passive: true });
}

function onMouseMove(e: MouseEvent): void {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
}

function onMouseEnter(): void {
  isVisible = true;
  if (cursorElements) {
    cursorElements.dot.classList.remove('hidden');
    cursorElements.ring.classList.remove('hidden');
  }
}

function onMouseLeave(): void {
  isVisible = false;
  if (cursorElements) {
    cursorElements.dot.classList.add('hidden');
    cursorElements.ring.classList.add('hidden');
  }
}

function onMouseOver(e: Event): void {
  const target = e.target as HTMLElement;
  if (isInteractive(target)) {
    isHovering = true;
    cursorElements?.ring.classList.add('active');
  }
}

function onMouseOut(e: Event): void {
  const target = e.target as HTMLElement;
  if (isInteractive(target)) {
    isHovering = false;
    cursorElements?.ring.classList.remove('active');
  }
}

function onMouseDown(): void {
  cursorElements?.dot.classList.add('active');
  cursorElements?.ring.classList.add('active');
}

function onMouseUp(): void {
  cursorElements?.dot.classList.remove('active');
  if (!isHovering) {
    cursorElements?.ring.classList.remove('active');
  }
}

function onScroll(): void {
  // Hide cursor during scroll
  if (cursorElements) {
    cursorElements.dot.style.opacity = '0';
    cursorElements.ring.style.opacity = '0';
  }
  
  clearTimeout((window as any).__cursorScrollTimeout);
  (window as any).__cursorScrollTimeout = setTimeout(() => {
    if (cursorElements && isVisible) {
      cursorElements.dot.style.opacity = '';
      cursorElements.ring.style.opacity = '';
    }
  }, 150);
}

function isInteractive(element: HTMLElement): boolean {
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
  const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'slider'];
  
  if (interactiveTags.includes(element.tagName)) return true;
  if (element.getAttribute('role') && interactiveRoles.includes(element.getAttribute('role')!)) return true;
  if (element.hasAttribute('data-cursor-hover')) return true;
  if (element.closest('[data-cursor-hover]')) return true;
  if (element.style.cursor === 'pointer' || getComputedStyle(element).cursor === 'pointer') return true;
  
  return false;
}

function startAnimationLoop(): void {
  function animate(): void {
    if (!cursorElements) return;
    
    // Smooth interpolation
    const easing = 0.15;
    currentPosition.x += (mousePosition.x - currentPosition.x) * easing;
    currentPosition.y += (mousePosition.y - currentPosition.y) * easing;
    
    cursorElements.dot.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px) translate(-50%, -50%)`;
    cursorElements.ring.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px) translate(-50%, -50%)`;
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  animate();
}

export function setCursorStyle(style: 'default' | 'hidden' | 'text' | 'grab' | 'grabbing'): void {
  if (!cursorElements) return;
  
  switch (style) {
    case 'hidden':
      cursorElements.dot.classList.add('hidden');
      cursorElements.ring.classList.add('hidden');
      break;
    case 'text':
      cursorElements.dot.style.width = '2px';
      cursorElements.dot.style.height = '20px';
      cursorElements.dot.style.borderRadius = '0';
      cursorElements.ring.style.opacity = '0';
      break;
    case 'grab':
      cursorElements.dot.style.transform += ' scale(0.5)';
      cursorElements.ring.style.borderColor = 'var(--color-accent)';
      break;
    case 'grabbing':
      cursorElements.dot.style.transform += ' scale(0.3)';
      cursorElements.ring.style.borderColor = 'var(--color-accent)';
      cursorElements.ring.style.width = '50px';
      cursorElements.ring.style.height = '50px';
      break;
    default:
      cursorElements.dot.style.width = '';
      cursorElements.dot.style.height = '';
      cursorElements.dot.style.borderRadius = '';
      cursorElements.ring.style.opacity = '';
      cursorElements.ring.style.borderColor = '';
      cursorElements.ring.style.width = '';
      cursorElements.ring.style.height = '';
      if (isVisible) {
        cursorElements.dot.classList.remove('hidden');
        cursorElements.ring.classList.remove('hidden');
      }
  }
}

export function destroyCursor(): void {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  
  cursorElements?.dot.remove();
  cursorElements?.ring.remove();
  cursorElements = null;
}