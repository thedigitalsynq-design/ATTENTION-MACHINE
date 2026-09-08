import { createScrollTrigger } from '../utils/scrollTriggers';

const interruptSequence = [
  { text: 'SCROLLING', delay: 0 },
  { text: 'IS EASY.', delay: 1500 },
  { text: 'STOPPING', delay: 2500 },
  { text: 'IS HARD.', delay: 4000 },
  { text: 'THAT\'S', delay: 5500 },
  { text: 'OUR JOB.', delay: 7000 },
];

export class Interrupt {
  private container: HTMLElement;
  private isPlayed = false;
  private prefersReducedMotion = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.setupTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="interrupt-inner" role="dialog" aria-live="polite" aria-label="Interrupt sequence">
        <div class="interrupt-content">
          <div class="interrupt-lines"></div>
        </div>
        <div class="interrupt-continue" data-cursor-hover="true">
          <span class="continue-text">KEEP SCROLLING</span>
          <svg class="continue-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M12 5v14"></path>
            <path d="M19 12l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-interrupt {
        position: relative;
        min-height: 100vh;
        min-height: 100svh;
        background: var(--color-black);
      }
      
      .interrupt-inner {
        position: relative;
        width: 100%;
        height: 100vh;
        height: 100svh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--container-padding);
        overflow: hidden;
      }
      
      .interrupt-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 1000px;
      }
      
      .interrupt-lines {
        font-family: var(--font-display);
        font-size: var(--text-5xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-white);
        text-align: center;
        min-height: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .interrupt-line {
        display: block;
        opacity: 0;
        transform: translateY(40px) scale(0.9);
        clip-path: inset(0 100% 0 0);
      }
      
      .interrupt-line.revealed {
        animation: interruptLineReveal 1.2s var(--ease-out) forwards;
      }
      
      .interrupt-line.accent {
        color: var(--color-accent);
      }
      
      @keyframes interruptLineReveal {
        0% { opacity: 0; transform: translateY(40px) scale(0.9); clip-path: inset(0 100% 0 0); }
        15% { opacity: 1; clip-path: inset(0 100% 0 0); }
        100% { opacity: 1; transform: translateY(0) scale(1); clip-path: inset(0 0 0 0); }
      }
      
      .interrupt-continue {
        position: absolute;
        bottom: var(--space-8);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--duration-slow) var(--ease-out), color var(--duration-base) var(--ease-out);
        z-index: 10;
      }
      
      .interrupt-continue.visible {
        opacity: 1;
        pointer-events: auto;
      }
      
      .interrupt-continue:hover {
        color: var(--color-accent);
      }
      
      .interrupt-continue:hover .continue-arrow {
        animation: continueArrowBounce 0.8s var(--ease-spring) infinite;
      }
      
      @keyframes continueArrowBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
      
      .continue-arrow {
        flex-shrink: 0;
      }
      
      @media (max-width: 768px) {
        .interrupt-lines {
          font-size: var(--text-3xl);
        }
        
        .interrupt-continue {
          font-size: 0.625rem;
        }
      }
      
      @media (max-width: 480px) {
        .interrupt-lines {
          font-size: var(--text-2xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private setupTrigger(): void {
    createScrollTrigger({
      id: 'interrupt-play',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => this.playSequence(),
      onEnterBack: () => this.playSequence(),
    });
  }
  
  private async playSequence(): Promise<void> {
    if (this.isPlayed && !this.prefersReducedMotion) return;
    this.isPlayed = true;
    
    const linesContainer = this.container.querySelector('.interrupt-lines') as HTMLElement;
    const continueBtn = this.container.querySelector('.interrupt-continue') as HTMLElement;
    
    // Clear previous
    linesContainer.innerHTML = '';
    
    if (this.prefersReducedMotion) {
      // Show all at once
      interruptSequence.forEach((item, i) => {
        const line = document.createElement('div');
        line.className = `interrupt-line revealed${item.text.includes('OUR JOB') || item.text.includes('IS HARD') ? ' accent' : ''}`;
        line.textContent = item.text;
        linesContainer.appendChild(line);
      });
      
      setTimeout(() => {
        continueBtn?.classList.add('visible');
      }, 100);
      return;
    }
    
    // Play sequence
    for (const item of interruptSequence) {
      const line = document.createElement('div');
      line.className = `interrupt-line${item.text.includes('OUR JOB') || item.text.includes('IS HARD') ? ' accent' : ''}`;
      line.textContent = item.text;
      linesContainer.appendChild(line);
      
      await new Promise(r => setTimeout(r, 50));
      line.classList.add('revealed');
      
      await new Promise(r => setTimeout(r, item.delay || 1000));
    }
    
    // Show continue
    await new Promise(r => setTimeout(r, 500));
    continueBtn?.classList.add('visible');
  }
  
  destroy(): void {}
}