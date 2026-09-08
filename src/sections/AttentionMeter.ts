import { createScrollTrigger } from '../utils/scrollTriggers';
import { random, lerp } from '../utils/helpers';

export class AttentionMeter {
  private container: HTMLElement;
  private level = 0;
  private targetLevel = 0;
  private isMaxed = false;
  private animationFrame: number | null = null;
  private interactionCount = 0;
  private lastInteraction = 0;
  private prefersReducedMotion = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.bindInteractions();
    this.startAnimation();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="attention-meter-inner">
        <div class="meter-header">
          <h2 class="meter-title" id="attention-heading">
            <span class="title-word">ATTENTION</span>
            <span class="title-word">LEVEL</span>
          </h2>
          <div class="meter-value" aria-live="polite">
            <span class="value-number">0</span>
            <span class="value-suffix">%</span>
          </div>
        </div>
        
        <div class="meter-visual" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Attention level">
          <div class="meter-track">
            <div class="meter-fill"></div>
            <div class="meter-glow"></div>
          </div>
          <div class="meter-markers">
            ${[0, 25, 50, 75, 100].map(v => `<span class="meter-marker" data-value="${v}">${v}</span>`).join('')}
          </div>
        </div>
        
        <div class="meter-labels">
          <span class="meter-label meter-label-low">PASSIVE</span>
          <span class="meter-label meter-label-mid">ENGAGED</span>
          <span class="meter-label meter-label-high">CAPTIVATED</span>
        </div>
        
        <p class="meter-message" aria-live="polite"></p>
        
        <div class="meter-interaction-hint" data-cursor-hover="true">
          <span>SCROLL, HOVER, CLICK TO INCREASE</span>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-attention-meter {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-16) var(--container-padding);
      }
      
      .attention-meter-inner {
        width: 100%;
        max-width: 800px;
        text-align: center;
      }
      
      .meter-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-8);
      }
      
      .meter-title {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      
      .meter-title .title-word {
        display: block;
      }
      
      .meter-value {
        font-family: var(--font-mono);
        font-size: var(--text-5xl);
        font-weight: 700;
        color: var(--color-white);
        line-height: 1;
      }
      
      .meter-value .value-suffix {
        font-size: var(--text-2xl);
        font-weight: 400;
        color: var(--color-gray-500);
      }
      
      .attention-meter.maxed .meter-value {
        color: var(--color-accent);
      }
      
      .attention-meter.maxed .meter-value .value-suffix {
        color: var(--color-accent);
      }
      
      .meter-visual {
        position: relative;
        height: 60px;
        margin-bottom: var(--space-6);
      }
      
      .meter-track {
        position: relative;
        height: 8px;
        background: var(--color-gray-200);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .meter-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
        border-radius: 4px;
        transition: width var(--duration-slow) var(--ease-out);
        transform-origin: left center;
      }
      
      .attention-meter.maxed .meter-fill {
        animation: meterFillPulse 1.5s var(--ease-in-out) infinite;
      }
      
      @keyframes meterFillPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
      
      .meter-glow {
        position: absolute;
        top: 50%;
        left: 0;
        width: 0%;
        height: 200%;
        transform: translateY(-50%);
        background: radial-gradient(ellipse at left center, var(--color-accent-glow) 0%, transparent 70%);
        pointer-events: none;
        transition: width var(--duration-slow) var(--ease-out);
      }
      
      .meter-markers {
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-3);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      .meter-marker {
        position: relative;
      }
      
      .meter-marker::before {
        content: '';
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 8px;
        background: var(--color-gray-300);
      }
      
      .meter-marker.active {
        color: var(--color-accent);
      }
      
      .meter-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-8);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .meter-label {
        opacity: 0.5;
        transition: opacity var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out);
      }
      
      .meter-label.active {
        opacity: 1;
        color: var(--color-white);
      }
      
      .attention-meter.maxed .meter-label-high {
        opacity: 1;
        color: var(--color-accent);
        animation: labelPulse 1s var(--ease-in-out) infinite;
      }
      
      @keyframes labelPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .meter-message {
        font-family: var(--font-ui);
        font-size: var(--text-lg);
        line-height: 1.6;
        color: var(--color-gray-500);
        min-height: 2.5em;
        opacity: 0;
        transition: opacity var(--duration-slow) var(--ease-out), color var(--duration-base) var(--ease-out);
      }
      
      .meter-message.visible {
        opacity: 1;
      }
      
      .attention-meter.maxed .meter-message {
        color: var(--color-white);
        font-weight: 500;
      }
      
      .meter-interaction-hint {
        margin-top: var(--space-8);
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
        display: inline-block;
        opacity: 0;
        animation: hintFade 1s var(--ease-out) 1s forwards;
      }
      
      @keyframes hintFade {
        to { opacity: 1; }
      }
      
      .attention-meter.maxed .meter-interaction-hint {
        display: none;
      }
      
      @media (max-width: 768px) {
        .meter-value {
          font-size: var(--text-4xl);
        }
        
        .meter-visual {
          height: 40px;
        }
        
        .meter-track {
          height: 6px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindInteractions(): void {
    const interactions = ['scroll', 'mousemove', 'click', 'keydown'];
    
    interactions.forEach(type => {
      window.addEventListener(type, this.handleInteraction.bind(this), { passive: true });
    });
    
    // Track specific element interactions
    this.container.addEventListener('mouseenter', () => this.increment(1));
    this.container.querySelectorAll('[data-cursor-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => this.increment(2));
      el.addEventListener('click', () => this.increment(5));
    });
  }
  
  private handleInteraction(): void {
    const now = Date.now();
    if (now - this.lastInteraction < 100) return; // Throttle
    this.lastInteraction = now;
    
    this.interactionCount++;
    this.increment(this.getIncrementAmount());
  }
  
  private getIncrementAmount(): number {
    // Diminishing returns
    if (this.level < 25) return 2;
    if (this.level < 50) return 1.5;
    if (this.level < 75) return 1;
    return 0.5;
  }
  
  private increment(amount: number): void {
    if (this.isMaxed) return;
    
    this.targetLevel = Math.min(100, this.targetLevel + amount);
    
    if (this.targetLevel >= 100 && !this.isMaxed) {
      this.targetLevel = 100;
      this.triggerMaxed();
    }
  }
  
  private triggerMaxed(): void {
    this.isMaxed = true;
    this.container.classList.add('maxed');
    
    // Show final message
    const message = this.container.querySelector('.meter-message') as HTMLElement;
    if (message) {
      message.textContent = 'YOU STOPPED. THAT\'S THE POINT.';
      message.classList.add('visible');
    }
    
    // Update labels
    this.container.querySelectorAll('.meter-label').forEach((label, i) => {
      label.classList.toggle('active', i === 2);
    });
    
    // Update markers
    this.container.querySelectorAll('.meter-marker').forEach(marker => {
      marker.classList.add('active');
    });
    
    // Update progressbar
    const progressbar = this.container.querySelector('[role="progressbar"]');
    progressbar?.setAttribute('aria-valuenow', '100');
  }
  
  private startAnimation(): void {
    if (this.prefersReducedMotion) {
      this.level = this.targetLevel;
      this.updateVisuals();
      return;
    }
    
    const animate = () => {
      // Smooth interpolation
      this.level = lerp(this.level, this.targetLevel, 0.05);
      this.updateVisuals();
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private updateVisuals(): void {
    const fill = this.container.querySelector('.meter-fill') as HTMLElement;
    const glow = this.container.querySelector('.meter-glow') as HTMLElement;
    const valueNumber = this.container.querySelector('.value-number') as HTMLElement;
    const progressbar = this.container.querySelector('[role="progressbar"]');
    
    const displayLevel = Math.round(this.level);
    
    if (fill) fill.style.width = `${this.level}%`;
    if (glow) glow.style.width = `${this.level}%`;
    if (valueNumber) valueNumber.textContent = displayLevel.toString();
    if (progressbar) progressbar.setAttribute('aria-valuenow', displayLevel.toString());
    
    // Update labels based on level
    const labels = this.container.querySelectorAll('.meter-label');
    if (this.level >= 75) {
      labels[0]?.classList.remove('active');
      labels[1]?.classList.remove('active');
      labels[2]?.classList.add('active');
    } else if (this.level >= 30) {
      labels[0]?.classList.remove('active');
      labels[1]?.classList.add('active');
      labels[2]?.classList.remove('active');
    } else {
      labels[0]?.classList.add('active');
      labels[1]?.classList.remove('active');
      labels[2]?.classList.remove('active');
    }
    
    // Update markers
    this.container.querySelectorAll('.meter-marker').forEach(marker => {
      const value = parseInt(marker.getAttribute('data-value') || '0');
      marker.classList.toggle('active', this.level >= value);
    });
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'attention-meter-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        this.increment(10); // Initial boost on enter
      },
    });
  }
  
  destroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}