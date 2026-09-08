import './styles/main.css';
import { App } from './App';
import { initLenis } from './utils/lenis';
import { initCursor } from './utils/cursor';
import { initScrollTriggers } from './utils/scrollTriggers';
import { initSound } from './utils/sound';

// Initialize core systems
initLenis();
initCursor();
initScrollTriggers();

// Global creative overlays — noise grain + scanlines
function initCreativeOverlays() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // SVG noise filter
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:fixed;inset:0;width:0;height:0;pointer-events:none;z-index:9999;';
  svg.innerHTML = `
    <defs>
      <filter id="noiseFilter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);

  // Noise overlay div
  const noise = document.createElement('div');
  noise.setAttribute('aria-hidden', 'true');
  noise.style.cssText = `
    position: fixed; inset: -50%; width: 200%; height: 200%;
    pointer-events: none; z-index: 9998;
    filter: url(#noiseFilter);
    opacity: 0.035;
    animation: grainShift 8s steps(10) infinite;
    mix-blend-mode: overlay;
  `;
  document.body.appendChild(noise);

  // Scanline overlay
  const scanlines = document.createElement('div');
  scanlines.setAttribute('aria-hidden', 'true');
  scanlines.style.cssText = `
    position: fixed; inset: 0;
    pointer-events: none; z-index: 9997;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.03) 1px,
      rgba(0, 0, 0, 0.03) 2px
    );
    opacity: 0.4;
  `;
  document.body.appendChild(scanlines);

  // Subtle vignette
  const vignette = document.createElement('div');
  vignette.setAttribute('aria-hidden', 'true');
  vignette.style.cssText = `
    position: fixed; inset: 0;
    pointer-events: none; z-index: 9996;
    background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%);
  `;
  document.body.appendChild(vignette);
}
initCreativeOverlays();

// Mount app
const app = new App();
app.mount('#app');

// Initialize sound after user interaction
let soundInitialized = false;
const initSoundOnce = () => {
  if (!soundInitialized) {
    initSound();
    soundInitialized = true;
  }
};

['click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, initSoundOnce, { once: true, passive: true });
});

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  // Store opening experience reference for global skip
  const checkOpening = setInterval(() => {
    const opening = document.querySelector('.opening-experience');
    if (opening && !(window as any).__openingExperience) {
      // The OpeningExperience class sets itself up
    }
    if (document.body.classList.contains('loaded')) {
      clearInterval(checkOpening);
    }
  }, 100);
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log(`[Attention Machine] Load time: ${Math.round(perf.loadEventEnd - perf.startTime)}ms`);
  });
}

// Global error handling
window.addEventListener('error', (e) => {
  console.error('[Attention Machine] Global error:', e.error);
}, false);

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Attention Machine] Unhandled rejection:', e.reason);
}, false);