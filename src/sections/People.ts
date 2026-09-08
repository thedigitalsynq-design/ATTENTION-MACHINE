import { teamMembers } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

export class People {
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
      <div class="people-inner">
        <header class="people-header">
          <h2 class="people-title" id="people-heading">
            <span class="title-word">THE</span>
            <span class="title-word">COLLECTIVE</span>
          </h2>
          <p class="people-subtitle">Not employees. Creative partners. Each with their own obsession.</p>
        </header>
        
        <div class="people-grid" role="list" aria-label="Team members">
          ${teamMembers.map((member, index) => `
            <article class="person-card" data-index="${index}" role="listitem">
              <div class="person-portrait" aria-hidden="true">
                <div class="portrait-placeholder">
                  <span class="initials">${member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
              </div>
              <div class="person-info">
                <h3 class="person-name">${member.name}</h3>
                <p class="person-role">${member.role}</p>
                <div class="person-meta">
                  <div class="meta-item">
                    <span class="meta-label">OBSESSION</span>
                    <span class="meta-value">${member.obsession}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">PLATFORM</span>
                    <span class="meta-value">${member.platform}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">SUPERPOWER</span>
                    <span class="meta-value">${member.superpower}</span>
                  </div>
                </div>
              </div>
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
      .section-people {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .people-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .people-header {
        text-align: center;
        margin-bottom: var(--space-12);
      }
      
      .people-title {
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
      
      .people-title .title-word {
        display: block;
      }
      
      .people-title .title-word:last-child {
        color: var(--color-accent);
      }
      
      .people-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .people-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-6);
        overflow-y: auto;
        padding: var(--space-4);
      }
      
      .person-card {
        display: flex;
        gap: var(--space-6);
        padding: var(--space-6);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .person-card:hover {
        border-color: var(--color-accent);
        transform: translateY(-4px);
      }
      
      .person-portrait {
        flex-shrink: 0;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-gray-200);
      }
      
      .portrait-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
      }
      
      .initials {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--color-white);
      }
      
      .person-info {
        flex: 1;
        min-width: 0;
      }
      
      .person-name {
        font-family: var(--font-display);
        font-size: var(--text-xl);
        font-weight: 600;
        color: var(--color-white);
        margin-bottom: var(--space-1);
      }
      
      .person-role {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: var(--space-6);
      }
      
      .person-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      
      .meta-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      
      .meta-label {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .meta-value {
        font-family: var(--font-ui);
        font-size: var(--text-sm);
        line-height: 1.5;
        color: var(--color-white);
      }
      
      @media (max-width: 768px) {
        .people-title {
          font-size: var(--text-2xl);
        }
        
        .person-card {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .person-portrait {
          width: 80px;
          height: 80px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'people-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        const cards = Array.from(this.container.querySelectorAll('.person-card')) as HTMLElement[];
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.transition = 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
      },
    });
  }
  
  destroy(): void {}
}