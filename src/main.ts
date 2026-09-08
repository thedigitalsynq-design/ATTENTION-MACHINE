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