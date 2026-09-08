import { manifestoLines } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

export class Manifesto {
  private container: HTMLElement;
  private prefersReducedMotion = false;
  private currentLine = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="manifesto-inner">
        <div class="manifesto-content" role="region" aria-live="polite" aria-label="Manifesto">
          <div class="manifesto-lines"></div>
        </div>
        <div class="manifesto-progress" aria-hidden="true">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">0 / ${manifestoLines.length}</span>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-manifesto {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-black);
      }
      
      .manifesto-inner {
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: var(--container-padding);
        text-align: center;
      }
      
      .manifesto-content {
        min-height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
      }
      
      .manifesto-line {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--color-white);
        opacity: 0;
        transform: translateY(40px) scale(0.9);
        clip-path: inset(0 100% 0 0);
        white-space: nowrap;
        position: relative;
      }
      
      .manifesto-line .typewriter-cursor {
        display: inline-block;
        width: 3px;
        height: 0.9em;
        background: var(--color-accent);
        margin-left: 4px;
        vertical-align: text-bottom;
        animation: cursorBlink 0.7s step-end infinite;
      }
      
      .manifesto-line.revealed {
        animation: manifestoLineReveal 1s var(--ease-out) forwards;
      }
      
      .manifesto-line.accent {
        color: var(--color-accent);
      }
      
      .manifesto-line.hold {
        opacity: 1;
        transform: translateY(0) scale(1);
        clip-path: inset(0 0 0 0);
      }
      
      @keyframes manifestoLineReveal {
        0% { opacity: 0; transform: translateY(40px) scale(0.9); clip-path: inset(0 100% 0 0); }
        15% { opacity: 1; clip-path: inset(0 100% 0 0); }
        100% { opacity: 1; transform: translateY(0) scale(1); clip-path: inset(0 0 0 0); }
      }
      
      .manifesto-progress {
        position: fixed;
        bottom: var(--space-8);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        width: 200px;
        opacity: 0;
        transition: opacity var(--duration-slow) var(--ease-out);
        pointer-events: none;
        z-index: var(--z-ui);
      }
      
      .manifesto-progress.visible {
        opacity: 1;
      }
      
      .progress-bar {
        width: 100%;
        height: 3px;
        background: var(--color-gray-200);
        border-radius: 2px;
        overflow: hidden;
      }
      
      .progress-fill {
        width: 0%;
        height: 100%;
        background: var(--color-accent);
        border-radius: 2px;
        transition: width var(--duration-slow) var(--ease-out);
      }
      
      .progress-text {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      @media (max-width: 768px) {
        .manifesto-line {
          font-size: var(--text-2xl);
        }
        
        .manifesto-progress {
          bottom: var(--space-6);
          width: 160px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'manifesto-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => this.playManifesto(),
      onLeave: () => this.pauseManifesto(),
      onEnterBack: () => this.playManifesto(),
      onLeaveBack: () => this.pauseManifesto(),
    });
  }
  
  private playManifesto(): void {
    if (this.intervalId) return;
    
    const progress = this.container.querySelector('.manifesto-progress') as HTMLElement;
    progress.classList.add('visible');
    
    if (this.prefersReducedMotion) {
      this.showAllLines();
      return;
    }
    
    this.cycleLines();
  }
  
  private pauseManifesto(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private showAllLines(): void {
    const linesContainer = this.container.querySelector('.manifesto-lines') as HTMLElement;
    linesContainer.innerHTML = '';
    
    manifestoLines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = `manifesto-line revealed hold${i % 2 === 1 ? ' accent' : ''}`;
      el.textContent = line;
      linesContainer.appendChild(el);
    });
    
    this.updateProgress(manifestoLines.length);
  }
  
  private cycleLines(): void {
    const linesContainer = this.container.querySelector('.manifesto-lines') as HTMLElement;
    
    const showNextLine = () => {
      if (this.currentLine >= manifestoLines.length) {
        this.currentLine = 0;
        linesContainer.innerHTML = '';
      }
      
      const line = manifestoLines[this.currentLine];
      const el = document.createElement('div');
      el.className = `manifesto-line${this.currentLine % 2 === 1 ? ' accent' : ''}`;
      
      // Add typewriter cursor
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      el.textContent = line;
      el.appendChild(cursor);
      
      linesContainer.appendChild(el);
      
      // Trigger animation
      requestAnimationFrame(() => {
        el.classList.add('revealed');
      });
      
      // Hold then remove
      setTimeout(() => {
        el.classList.remove('revealed');
        el.classList.add('hold');
      }, 2500);
      
      setTimeout(() => {
        el.style.animation = 'manifestoLineFadeOut 0.5s var(--ease-in) forwards';
        setTimeout(() => el.remove(), 500);
      }, 4500);
      
      this.currentLine++;
      this.updateProgress(this.currentLine);
    };
    
    // Add fade out animation
    if (!document.querySelector('#manifesto-fadeout')) {
      const style = document.createElement('style');
      style.id = 'manifesto-fadeout';
      style.textContent = `
        @keyframes manifestoLineFadeOut {
          to { opacity: 0; transform: translateY(-20px) scale(0.9); clip-path: inset(0 0 0 100%); }
        }
      `;
      document.head.appendChild(style);
    }
    
    showNextLine();
    
    this.intervalId = setInterval(showNextLine, 5000);
  }
  
  private updateProgress(current: number): void {
    const fill = this.container.querySelector('.progress-fill') as HTMLElement;
    const text = this.container.querySelector('.progress-text') as HTMLElement;
    
    const progress = (current / manifestoLines.length) * 100;
    fill.style.width = `${progress}%`;
    text.textContent = `${current} / ${manifestoLines.length}`;
  }
  
  destroy(): void {
    this.pauseManifesto();
  }
}