import { aboutBeliefs } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

export class About {
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
      <div class="about-inner">
        <header class="about-header">
          <h2 class="about-title" id="think-heading">
            <span class="title-word">ABOUT</span>
            <span class="title-word">US</span>
          </h2>
          <p class="about-subtitle">No mission statements. Just what we believe, how we think, and what we refuse.</p>
        </header>
        
        <div class="about-grid" role="list" aria-label="Our beliefs">
          ${aboutBeliefs.map((section, index) => `
            <article class="about-section" data-index="${index}" role="listitem">
              <h3 class="section-title">${section.title}</h3>
              <ul class="section-items">
                ${section.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </article>
          `).join('')}
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-think {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .about-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .about-header {
        text-align: center;
        margin-bottom: var(--space-12);
      }
      
      .about-title {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--color-white);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-bottom: var(--space-4);
      }
      
      .about-title .title-word {
        display: block;
      }
      
      .about-title .title-word:last-child {
        color: var(--color-accent);
      }
      
      .about-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .about-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--space-6);
        overflow-y: auto;
        padding: var(--space-4);
      }
      
      .about-section {
        position: relative;
        padding: var(--space-8);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .about-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--color-accent);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--duration-slow) var(--ease-out);
      }
      
      .about-section:hover {
        border-color: var(--color-accent);
        transform: translateY(-4px);
      }
      
      .about-section:hover::before {
        transform: scaleX(1);
      }
      
      .section-title {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--color-gray-200);
      }
      
      .section-items {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      
      .section-items li {
        font-family: var(--font-ui);
        font-size: var(--text-base);
        line-height: 1.6;
        color: var(--color-white);
        position: relative;
        padding-left: var(--space-6);
      }
      
      .section-items li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.6em;
        width: 4px;
        height: 4px;
        background: var(--color-gray-400);
        border-radius: 50%;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .about-section:hover .section-items li::before {
        background: var(--color-accent);
        transform: scale(1.5);
      }
      
      @media (max-width: 768px) {
        .about-title {
          font-size: var(--text-2xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'about-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        const sections = Array.from(this.container.querySelectorAll('.about-section')) as HTMLElement[];
        sections.forEach((section, i) => {
          section.style.opacity = '0';
          section.style.transform = 'translateY(30px)';
          setTimeout(() => {
            section.style.transition = 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          }, i * 100);
        });
      },
    });
  }
  
  destroy(): void {}
}