import { statistics } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';
import { formatNumber } from '../utils/helpers';

export class Performance {
  private container: HTMLElement;
  private prefersReducedMotion = false;
  private counters: Map<string, { current: number; target: number; element: HTMLElement }> = new Map();
  private animationFrame: number | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.initCounters();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="performance-inner">
        <header class="performance-header">
          <h2 class="performance-title" id="results-heading">
            <span class="title-word">ART IS</span>
            <span class="title-word">GREAT.</span>
          </h2>
          <h2 class="performance-title performance-title-2">
            <span class="title-word">BUT DOES</span>
            <span class="title-word">IT WORK?</span>
          </h2>
        </header>
        
        <div class="performance-grid" role="list" aria-label="Performance metrics">
          ${statistics.map((stat, index) => `
            <article class="performance-stat" data-index="${index}" role="listitem">
              <div class="stat-visual" aria-hidden="true">
                <div class="stat-ring">
                  <svg viewBox="0 0 100 100">
                    <circle class="stat-ring-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="stat-ring-progress" cx="50" cy="50" r="45"></circle>
                  </svg>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-value" data-target="${this.parseValue(stat.value)}" data-suffix="${this.getSuffix(stat.value)}">0</div>
                <div class="stat-label">${stat.label}</div>
                <p class="stat-description">${stat.description}</p>
              </div>
            </article>
          `).join('')}
        </div>
        
        <div class="performance-disclaimer">
          <p>All statistics are configurable placeholders. No actual client results are fabricated.</p>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-results {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .performance-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .performance-header {
        text-align: center;
        margin-bottom: var(--space-12);
      }
      
      .performance-title {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--color-white);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-bottom: var(--space-2);
      }
      
      .performance-title .title-word {
        display: block;
      }
      
      .performance-title .title-word:last-child {
        color: var(--color-gray-500);
      }
      
      .performance-title-2 {
        margin-top: var(--space-4);
      }
      
      .performance-title-2 .title-word:last-child {
        color: var(--color-accent);
      }
      
      .performance-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-6);
        align-content: start;
      }
      
      .performance-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--space-6);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .performance-stat:hover {
        border-color: var(--color-accent);
        transform: translateY(-4px);
      }
      
      .stat-visual {
        width: 100px;
        height: 100px;
        margin-bottom: var(--space-4);
      }
      
      .stat-ring {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      
      .stat-ring-bg {
        fill: none;
        stroke: var(--color-gray-200);
        stroke-width: 4;
      }
      
      .stat-ring-progress {
        fill: none;
        stroke: var(--color-accent);
        stroke-width: 4;
        stroke-linecap: round;
        stroke-dasharray: 283;
        stroke-dashoffset: 283;
        transition: stroke-dashoffset var(--duration-slower) var(--ease-out);
      }
      
      .stat-content {
        flex: 1;
      }
      
      .stat-value {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 700;
        line-height: 1;
        color: var(--color-white);
        margin-bottom: var(--space-2);
      }
      
      .stat-label {
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        margin-bottom: var(--space-2);
      }
      
      .stat-description {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      .performance-disclaimer {
        text-align: center;
        padding-top: var(--space-8);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .performance-disclaimer p {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      @media (max-width: 768px) {
        .performance-title {
          font-size: var(--text-2xl);
        }
        
        .stat-value {
          font-size: var(--text-3xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private initCounters(): void {
    const elements = Array.from(this.container.querySelectorAll('.stat-value')) as HTMLElement[];
    elements.forEach(el => {
      const target = parseFloat(el.dataset.target!);
      const suffix = el.dataset.suffix || '';
      this.counters.set(el.dataset.target!, { current: 0, target, element: el });
    });
  }
  
  private parseValue(value: string): number {
    // Extract numeric value from strings like "2.1B+", "78%", "12.4%", "340%", "$127M+"
    const match = value.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  private getSuffix(value: string): string {
    if (value.includes('%')) return '%';
    if (value.includes('B')) return 'B+';
    if (value.includes('M')) return 'M+';
    if (value.includes('%')) return '%';
    return '';
  }
  
  private animateCounters(): void {
    if (this.prefersReducedMotion) {
      this.counters.forEach(({ target, element }, key) => {
        const suffix = element.dataset.suffix || '';
        element.textContent = this.formatValue(target, suffix);
      });
      return;
    }
    
    const animate = () => {
      let allComplete = true;
      
      this.counters.forEach(({ current, target, element }) => {
        if (current < target) {
          allComplete = false;
          const newCurrent = Math.min(target, current + (target - current) * 0.05);
          this.counters.set(element.dataset.target!, { ...this.counters.get(element.dataset.target!)!, current: newCurrent });
          
          const suffix = element.dataset.suffix || '';
          element.textContent = this.formatValue(newCurrent, suffix);
        }
      });
      
      if (!allComplete) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  private formatValue(value: number, suffix: string): string {
    if (suffix === 'B+' || suffix === 'M+') {
      return value.toFixed(suffix === 'B+' ? 1 : 0) + suffix;
    }
    if (suffix === '%') {
      return value.toFixed(1) + '%';
    }
    return Math.round(value).toString();
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'performance-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        this.animateCounters();
        
        // Animate rings
        const rings = Array.from(this.container.querySelectorAll('.stat-ring-progress')) as SVGCircleElement[];
        rings.forEach((ring, i) => {
          const stat = statistics[i];
          const target = this.parseValue(stat.value);
          const maxValue = this.getMaxValue(stat.label);
          const progress = Math.min(1, target / maxValue);
          const offset = 283 * (1 - progress);
          
          setTimeout(() => {
            (ring as SVGCircleElement).style.strokeDashoffset = offset.toString();
          }, i * 100);
        });
      },
    });
  }
  
  private getMaxValue(label: string): number {
    const maxes: Record<string, number> = {
      'TOTAL REACH': 3,
      'AVG. RETENTION': 100,
      'ENGAGEMENT RATE': 20,
      'CONVERSION LIFT': 500,
      'REVENUE GENERATED': 200,
    };
    return maxes[label] || 100;
  }
  
  destroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}