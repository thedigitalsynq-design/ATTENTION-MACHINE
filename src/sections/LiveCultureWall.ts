import { cultureItems } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

export class LiveCultureWall {
  private container: HTMLElement;
  private prefersReducedMotion = false;
  private autoScrollInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.bindEvents();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="culture-wall-inner">
        <header class="wall-header">
          <h2 class="wall-title" id="measure-heading">
            <span class="title-word">WHAT'S</span>
            <span class="title-word">MOVING?</span>
          </h2>
          <p class="wall-subtitle">Real-time cultural signals. Each item expands into an insight.</p>
        </header>
        
        <div class="wall-grid" role="list" aria-label="Culture signals">
          ${cultureItems.map((item, index) => `
            <article class="culture-card" data-type="${item.type}" data-index="${index}" role="listitem">
              <div class="card-type-badge" style="--badge-color: ${this.getTypeColor(item.type)};">
                ${item.type.toUpperCase()}
              </div>
              <h3 class="card-title">${item.title}</h3>
              <p class="card-description">${item.description}</p>
              <div class="card-platform">${item.platform}</div>
              <div class="card-expand" data-cursor-hover="true">
                <span>READ INSIGHT</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div class="card-insight" aria-hidden="true">
                <p>${item.insight}</p>
              </div>
            </article>
          `).join('')}
        </div>
        
        <div class="wall-footer">
          <p class="footer-text">Updated in real-time. Data from platform APIs, creator networks, and cultural observation.</p>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-measure {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .culture-wall-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .wall-header {
        text-align: center;
        margin-bottom: var(--space-10);
      }
      
      .wall-title {
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
      
      .wall-title .title-word {
        display: block;
      }
      
      .wall-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .wall-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-4);
        overflow-y: auto;
        padding: var(--space-4);
      }
      
      .culture-card {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: var(--space-6);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        transition: all var(--duration-base) var(--ease-out);
        overflow: hidden;
      }
      
      .culture-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--badge-color);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--duration-slow) var(--ease-out);
      }
      
      .culture-card:hover {
        border-color: var(--badge-color);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      
      .culture-card:hover::before {
        transform: scaleX(1);
      }
      
      .culture-card.expanded {
        z-index: 10;
        grid-column: span 2;
      }
      
      @media (max-width: 768px) {
        .culture-card.expanded {
          grid-column: span 1;
        }
      }
      
      .card-type-badge {
        display: inline-block;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--badge-color);
        padding: var(--space-1) var(--space-3);
        border: 1px solid var(--badge-color);
        border-radius: 2px;
        width: fit-content;
        margin-bottom: var(--space-4);
      }
      
      .card-title {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 600;
        line-height: 1.3;
        color: var(--color-white);
        margin-bottom: var(--space-3);
      }
      
      .card-description {
        font-size: var(--text-base);
        line-height: 1.6;
        color: var(--color-gray-400);
        margin-bottom: var(--space-4);
        flex: 1;
      }
      
      .card-platform {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
        margin-bottom: var(--space-4);
        padding-top: var(--space-4);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .card-expand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        cursor: pointer;
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .card-expand:hover {
        color: var(--badge-color);
      }
      
      .card-insight {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-6);
        background: linear-gradient(180deg, transparent 0%, var(--badge-color) 100%);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
        pointer-events: none;
        z-index: 2;
      }
      
      .culture-card.expanded .card-insight {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      
      .card-insight p {
        font-family: var(--font-ui);
        font-size: var(--text-base);
        line-height: 1.6;
        color: var(--color-black);
        text-align: center;
        max-width: 400px;
      }
      
      .wall-footer {
        text-align: center;
        padding-top: var(--space-8);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .footer-text {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      @media (max-width: 768px) {
        .wall-title {
          font-size: var(--text-2xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    const cards = Array.from(this.container.querySelectorAll('.culture-card')) as HTMLElement[];
    cards.forEach(card => {
      const expandBtn = card.querySelector('.card-expand') as HTMLElement | null;
      
      expandBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCard(card);
      });
      
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCard(card);
        }
      });
    });
  }
  
  private toggleCard(card: HTMLElement): void {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards
    const expandedCards = Array.from(this.container.querySelectorAll('.culture-card.expanded')) as HTMLElement[];
    expandedCards.forEach(c => {
      if (c !== card) c.classList.remove('expanded');
    });
    
    card.classList.toggle('expanded', !isExpanded);
  }
  
  private getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      trend: '#FF3B30',
      behavior: '#FF9F0A',
      format: '#AF52DE',
      meme: '#FF2D92',
      creator: '#34C759',
      observation: '#007AFF',
    };
    return colors[type] || '#FF3B30';
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'culture-wall-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        // Stagger card entrance
        const cards = Array.from(this.container.querySelectorAll('.culture-card')) as HTMLElement[];
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.transition = 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
      },
    });
  }
  
  destroy(): void {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  }
}