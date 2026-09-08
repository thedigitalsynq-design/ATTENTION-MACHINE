import { ideas } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';
import { randomChoice } from '../utils/helpers';

export class IdeaGenerator {
  private container: HTMLElement;
  private currentIdea = '';
  private prefersReducedMotion = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.bindEvents();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="idea-generator-inner">
        <header class="generator-header">
          <h2 class="generator-title" id="idea-heading">
            <span class="title-word">WHAT IF</span>
            <span class="title-word">WE DID</span>
            <span class="title-word">THIS?</span>
          </h2>
          <p class="generator-subtitle">A random creative provocation. Click for another.</p>
        </header>
        
        <div class="generator-main" role="region" aria-live="polite">
          <div class="idea-display">
            <p class="idea-text"></p>
          </div>
          <button class="generator-btn btn-primary" data-cursor-hover="true">
            <span>ANOTHER IDEA</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="generator-history" aria-label="Recent ideas">
          <h3 class="history-title">RECENT IDEAS</h3>
          <div class="history-list"></div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-idea-generator {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        background: var(--color-black);
      }
      
      .idea-generator-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .generator-header {
        text-align: center;
        margin-bottom: var(--space-10);
      }
      
      .generator-title {
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
      
      .generator-title .title-word {
        display: block;
      }
      
      .generator-title .title-word:last-child {
        color: var(--color-accent);
      }
      
      .generator-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .generator-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-8);
      }
      
      .idea-display {
        position: relative;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-8);
        max-width: 800px;
      }
      
      .idea-text {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.01em;
        color: var(--color-white);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
      }
      
      .idea-text.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .idea-text.changing {
        opacity: 0;
        transform: translateY(-20px);
      }
      
      .generator-btn {
        padding: var(--space-4) var(--space-8);
        font-size: var(--text-sm);
      }
      
      .generator-btn:hover svg {
        transform: translateX(8px);
      }
      
      .generator-history {
        width: 100%;
        max-width: 800px;
        margin-top: var(--space-8);
        padding-top: var(--space-8);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .history-title {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        margin-bottom: var(--space-4);
      }
      
      .history-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      
      .history-item {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
        padding: var(--space-2) var(--space-3);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 2px;
        cursor: default;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .history-item:hover {
        border-color: var(--color-accent);
        color: var(--color-white);
      }
      
      .history-item.latest {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
      
      @media (max-width: 768px) {
        .generator-title {
          font-size: var(--text-2xl);
        }
        
        .idea-text {
          font-size: var(--text-2xl);
        }
      }
      
      @media (max-width: 480px) {
        .idea-text {
          font-size: var(--text-xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    const btn = this.container.querySelector('.generator-btn') as HTMLButtonElement;
    btn?.addEventListener('click', () => this.generateIdea());
  }
  
  private generateIdea(): void {
    const textEl = this.container.querySelector('.idea-text') as HTMLElement;
    const historyList = this.container.querySelector('.history-list') as HTMLElement;
    
    // Animate out
    textEl.classList.remove('visible');
    textEl.classList.add('changing');
    
    setTimeout(() => {
      // Pick new idea (avoid immediate repeat)
      let newIdea = randomChoice(ideas);
      while (newIdea === this.currentIdea) {
        newIdea = randomChoice(ideas);
      }
      
      this.currentIdea = newIdea;
      textEl.textContent = newIdea;
      
      // Add to history
      const historyItem = document.createElement('span');
      historyItem.className = 'history-item latest';
      historyItem.textContent = newIdea;
      historyList.prepend(historyItem);
      
      // Remove previous latest class
      historyList.querySelectorAll('.history-item').forEach((item, i) => {
        if (i > 0) item.classList.remove('latest');
      });
      
      // Limit history
      while (historyList.children.length > 12) {
        historyList.lastChild?.remove();
      }
      
      // Animate in
      requestAnimationFrame(() => {
        textEl.classList.remove('changing');
        textEl.classList.add('visible');
      });
    }, 300);
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'idea-generator-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        // Generate first idea
        setTimeout(() => this.generateIdea(), 500);
      },
    });
  }
  
  destroy(): void {}
}