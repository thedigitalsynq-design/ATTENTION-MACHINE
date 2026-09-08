import { createScrollTrigger } from '../utils/scrollTriggers';

export class HumanSection {
  private container: HTMLElement;
  private prefersReducedMotion = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="human-inner">
        <div class="human-content">
          <h2 class="human-title" id="remember-heading">
            <span class="title-line">BEHIND EVERY</span>
            <span class="title-line">VIEW</span>
            <span class="title-line">IS A</span>
            <span class="title-line title-accent">HUMAN.</span>
          </h2>
          <p class="human-message">
            We create for people first.<br>
            Platforms second.
          </p>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-remember {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-black);
      }
      
      .human-inner {
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--container-padding);
        text-align: center;
      }
      
      .human-content {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity var(--duration-slower) var(--ease-out), transform var(--duration-slower) var(--ease-out);
      }
      
      .human-content.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .human-title {
        font-family: var(--font-display);
        font-size: var(--text-5xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-white);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-bottom: var(--space-8);
      }
      
      .human-title .title-line {
        display: block;
        opacity: 0;
        transform: translateY(30px);
      }
      
      .human-title .title-line.visible {
        animation: humanLineReveal 0.8s var(--ease-out) forwards;
      }
      
      .human-title .title-accent {
        color: var(--color-accent);
      }
      
      @keyframes humanLineReveal {
        to { opacity: 1; transform: translateY(0); }
      }
      
      .human-message {
        font-family: var(--font-ui);
        font-size: var(--text-xl);
        line-height: 1.6;
        color: var(--color-gray-400);
        max-width: 600px;
        margin: 0 auto;
        opacity: 0;
        transform: translateY(20px);
      }
      
      .human-message.visible {
        animation: humanMessageReveal 0.8s var(--ease-out) 0.8s forwards;
      }
      
      @keyframes humanMessageReveal {
        to { opacity: 1; transform: translateY(0); }
      }
      
      @media (max-width: 768px) {
        .human-title {
          font-size: var(--text-3xl);
        }
        
        .human-message {
          font-size: var(--text-lg);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'human-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        const content = this.container.querySelector('.human-content') as HTMLElement;
        const lines = this.container.querySelectorAll('.title-line');
        const message = this.container.querySelector('.human-message') as HTMLElement;
        
        content.classList.add('visible');
        
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('visible');
          }, i * 150);
        });
        
        setTimeout(() => {
          message.classList.add('visible');
        }, lines.length * 150 + 200);
      },
    });
  }
  
  destroy(): void {}
}