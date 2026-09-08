import { agencyConfig } from '../data/config';
import { wait, randomChoice } from '../utils/helpers';

const openingLines = [
  'WAIT.',
  'YOU\'RE ABOUT TO SEE A WEBSITE THAT DOESN\'T WANT YOU TO SCROLL.',
  'IT WANTS YOU TO STOP.',
];

const finalLines = [
  'ATTENTION',
  'DETECTED.',
];

export class OpeningExperience {
  private container: HTMLElement;
  private isSkipped = false;
  private skipTimeout: ReturnType<typeof setTimeout> | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    (window as any).__openingExperience = this;
    const skipBtn = this.container.querySelector('.opening-skip');
    skipBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.skip();
    });
    this.playSequence();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="opening-overlay" role="document">
        <div class="opening-content">
          <div class="opening-text" aria-live="polite"></div>
          <div class="opening-skip" data-cursor-hover="true">
            <span class="skip-text">SKIP</span>
            <svg class="skip-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 12 12 4 20 12"></polyline>
              <polyline points="4 12 12 20 20 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .opening-experience {
        position: fixed;
        inset: 0;
        z-index: var(--z-loading);
        background: var(--color-black);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .opening-overlay {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--container-padding);
      }
      
      .opening-content {
        text-align: center;
        max-width: 800px;
      }
      
      .opening-text {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--color-white);
        min-height: 6em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: var(--space-4);
      }
      
      .opening-text .line {
        display: block;
        opacity: 0;
        transform: translateY(30px);
        clip-path: inset(0 100% 0 0);
      }
      
      .opening-text .line.revealed {
        animation: lineReveal 1s var(--ease-out) forwards;
      }
      
      .opening-text .line.final {
        font-size: var(--text-5xl);
        color: var(--color-accent);
        letter-spacing: -0.03em;
      }
      
      @keyframes lineReveal {
        0% { opacity: 0; transform: translateY(30px); clip-path: inset(0 100% 0 0); }
        20% { opacity: 1; clip-path: inset(0 100% 0 0); }
        100% { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0 0); }
      }
      
      .opening-skip {
        position: absolute;
        bottom: var(--space-8);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-6);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid var(--color-gray-300);
        border-radius: 100px;
        backdrop-filter: blur(20px);
        opacity: 0;
        transition: opacity var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out);
        pointer-events: none;
      }
      
      .opening-skip.visible {
        opacity: 1;
        pointer-events: auto;
      }
      
      .opening-skip:hover {
        color: var(--color-accent);
        border-color: var(--color-accent);
      }
      
      .opening-skip:hover .skip-arrow {
        animation: skipArrowBounce 0.6s var(--ease-spring) infinite;
      }
      
      @keyframes skipArrowBounce {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(8px); }
      }
      
      .opening-experience.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--duration-slower) var(--ease-out);
      }
      
      @media (max-width: 768px) {
        .opening-text {
          font-size: var(--text-3xl);
        }
        
        .opening-text .line.final {
          font-size: var(--text-4xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private async playSequence(): Promise<void> {
    const textContainer = this.container.querySelector('.opening-text') as HTMLElement;
    const skipButton = this.container.querySelector('.opening-skip') as HTMLElement;
    
    // Show skip button after delay
    setTimeout(() => {
      skipButton?.classList.add('visible');
    }, 800);
    
    // Play lines
    for (let i = 0; i < openingLines.length; i++) {
      if (this.isSkipped) break;
      
      const line = document.createElement('div');
      line.className = 'line';
      line.textContent = openingLines[i];
      textContainer?.appendChild(line);
      
      // Trigger animation
      await wait(50);
      line.classList.add('revealed');
      
      await wait(Math.min(1100, openingLines[i].length * 12 + 450));
    }
    
    // Pause before final reveal
    await wait(250);
    
    if (this.isSkipped) return;
    
    // Clear and show final
    textContainer.innerHTML = '';
    
    for (let i = 0; i < finalLines.length; i++) {
      if (this.isSkipped) break;
      
      const line = document.createElement('div');
      line.className = `line final`;
      line.textContent = finalLines[i];
      textContainer?.appendChild(line);
      
      await wait(50);
      line.classList.add('revealed');
      
      await wait(350);
    }
    
    // Complete
    await wait(400);
    
    if (!this.isSkipped) {
      this.complete();
    }
  }
  
  private complete(): void {
    this.container.classList.add('fade-out');
    
    setTimeout(() => {
      this.container.style.display = 'none';
      // Trigger hero entrance
      document.dispatchEvent(new CustomEvent('openingComplete'));
    }, 1200);
  }
  
  skip(): void {
    this.isSkipped = true;
    this.complete();
  }
  
  destroy(): void {
    if (this.skipTimeout) clearTimeout(this.skipTimeout);
  }
}

// Auto-skip on user interaction
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === ' ') {
    const opening = document.querySelector('.opening-experience');
    if (opening && !opening.classList.contains('fade-out')) {
      // Find the instance and skip
      (window as any).__openingExperience?.skip();
    }
  }
});

document.addEventListener('click', (e) => {
  const opening = document.querySelector('.opening-experience');
  if (opening && !opening.classList.contains('fade-out') && !(e.target as HTMLElement).closest('.opening-skip')) {
    (window as any).__openingExperience?.skip();
  }
}, { once: true });