import { projects, cultureItems } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';
import { randomChoice, shuffle } from '../utils/helpers';

const contentTypes = [
  { type: 'VIDEO', icon: '▶', color: '#FF3B30' },
  { type: 'MEME', icon: '😆', color: '#FF9F0A' },
  { type: 'CAMPAIGN', icon: '⚡', color: '#AF52DE' },
  { type: 'POST', icon: '📝', color: '#007AFF' },
  { type: 'IDEA', icon: '💡', color: '#34C759' },
  { type: 'COMMENT', icon: '💬', color: '#FF2D92' },
  { type: 'TREND', icon: '📈', color: '#5856D6' },
  { type: 'CULTURE', icon: '🌊', color: '#FF9500' },
];

export class SocialFeed {
  private container: HTMLElement;
  private cards: HTMLElement[] = [];
  private currentIndex = 0;
  private isDragging = false;
  private startX = 0;
  private currentTranslateX = 0;
  private prefersReducedMotion = false;
  private autoAdvanceInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.initCards();
    this.bindEvents();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="social-feed-inner">
        <header class="feed-header">
          <h2 class="feed-title" id="discover-heading">
            <span class="title-word">THE SOCIAL FEED</span>
            <span class="title-word">THAT ISN'T A</span>
            <span class="title-word">SOCIAL FEED</span>
          </h2>
          <p class="feed-subtitle">Drag, swipe, or hover through content that reveals how attention actually works.</p>
        </header>
        
        <div class="feed-viewport" role="region" aria-label="Content feed" tabindex="0">
          <div class="feed-track"></div>
        </div>
        
        <div class="feed-controls" aria-hidden="true">
          <button class="feed-btn feed-btn-prev" aria-label="Previous" data-cursor-hover="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="feed-indicators"></div>
          <button class="feed-btn feed-btn-next" aria-label="Next" data-cursor-hover="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="feed-types" aria-hidden="true">
          ${contentTypes.map(t => `
            <span class="feed-type" style="--type-color: ${t.color};" data-type="${t.type.toLowerCase()}">
              <span class="type-icon">${t.icon}</span>
              <span class="type-label">${t.type}</span>
            </span>
          `).join('')}
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-discover {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .social-feed-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .feed-header {
        text-align: center;
        margin-bottom: var(--space-10);
      }
      
      .feed-title {
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
      
      .feed-title .title-word {
        display: block;
      }
      
      .feed-title .title-word:nth-child(2) {
        color: var(--color-gray-500);
      }
      
      .feed-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
        max-width: 600px;
        margin: 0 auto;
      }
      
      .feed-viewport {
        flex: 1;
        position: relative;
        overflow: hidden;
        border-radius: 4px;
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
      }
      
      .feed-track {
        display: flex;
        height: 100%;
        min-height: 500px;
        transition: transform var(--duration-slow) var(--ease-out);
        will-change: transform;
      }
      
      .feed-card {
        flex: 0 0 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        padding: var(--space-8);
        background: var(--color-black);
        overflow: hidden;
        transition: transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out);
        transform-style: preserve-3d;
        perspective: 1000px;
      }
      
      .feed-card:hover {
        box-shadow: 
          0 20px 40px rgba(0,0,0,0.4),
          0 0 0 1px var(--card-color, var(--color-accent));
      }
      
      .feed-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--card-color, var(--color-accent));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--duration-slow) var(--ease-out);
      }
      
      .feed-card.active::before {
        transform: scaleX(1);
      }
      
      .feed-card-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-6);
      }
      
      .feed-card-type {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1) var(--space-3);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--card-color, var(--color-accent));
        border: 1px solid currentColor;
        border-radius: 2px;
      }
      
      .feed-card-platform {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
      }
      
      .feed-card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .feed-card-main {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: var(--color-white);
        margin-bottom: var(--space-4);
      }
      
      .feed-card-insight {
        font-family: var(--font-ui);
        font-size: var(--text-lg);
        line-height: 1.6;
        color: var(--color-gray-400);
        margin-bottom: var(--space-6);
      }
      
      .feed-card-stats {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--color-gray-500);
      }
      
      .feed-card-stat {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }
      
      .feed-card-stat-value {
        color: var(--color-white);
        font-weight: 600;
      }
      
      .feed-card-why {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: var(--space-8);
        background: linear-gradient(180deg, transparent 0%, var(--card-color, var(--color-accent)) 100%);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
        pointer-events: none;
      }
      
      .feed-card:hover .feed-card-why,
      .feed-card:focus-within .feed-card-why {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      
      .feed-card-why-label {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-black);
        margin-bottom: var(--space-4);
      }
      
      .feed-card-why-factors {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      
      .feed-card-why-factor {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--color-black);
        background: rgba(255,255,255,0.8);
        padding: var(--space-1) var(--space-3);
        border-radius: 2px;
      }
      
      .feed-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-6);
        margin-top: var(--space-8);
      }
      
      .feed-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        color: var(--color-gray-500);
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .feed-btn:hover {
        background: var(--color-black);
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
      
      .feed-btn:disabled {
        opacity: 0.3;
        pointer-events: none;
      }
      
      .feed-indicators {
        display: flex;
        gap: var(--space-2);
      }
      
      .feed-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-gray-300);
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .feed-indicator.active {
        background: var(--color-accent);
        transform: scale(1.3);
      }
      
      .feed-types {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-2);
        margin-top: var(--space-8);
        padding-top: var(--space-8);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .feed-type {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 100px;
        transition: all var(--duration-base) var(--ease-out);
        cursor: default;
      }
      
      .feed-type.active {
        color: var(--color-black);
        background: var(--type-color);
        border-color: var(--type-color);
      }
      
      .type-icon {
        font-size: var(--text-sm);
      }
      
      @media (max-width: 768px) {
        .feed-title {
          font-size: var(--text-2xl);
        }
        
        .feed-card-main {
          font-size: var(--text-2xl);
        }
        
        .feed-viewport {
          min-height: 400px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private initCards(): void {
    const track = this.container.querySelector('.feed-track') as HTMLElement;
    const indicators = this.container.querySelector('.feed-indicators') as HTMLElement;
    
    // Combine projects and culture items for content
    const allContent = [
      ...projects.slice(0, 4).map(p => ({
        type: 'CAMPAIGN' as const,
        title: p.title,
        insight: p.idea,
        platform: 'CASE STUDY',
        stats: [
          { label: 'REACH', value: p.results[0]?.value || '—' },
          { label: 'ENGAGEMENT', value: p.results[1]?.value || '—' },
        ],
        whyFactors: ['CONTRAST', 'CURIOSITY', 'EMOTION', 'SURPRISE', 'IDENTITY'].slice(0, 3),
        color: '#FF3B30',
      })),
      ...cultureItems.slice(0, 4).map(c => ({
        type: c.type.toUpperCase(),
        title: c.title,
        insight: c.insight,
        platform: c.platform,
        stats: [
          { label: 'PLATFORM', value: c.platform },
        ],
        whyFactors: ['RELEVANCE', 'SURPRISE', 'IDENTITY', 'CONTRAST', 'CURIOSITY'].slice(0, 3),
        color: this.getTypeColor(c.type),
      })),
    ];
    
    // Shuffle for variety
    const shuffled = shuffle(allContent);
    
    shuffled.forEach((content, index) => {
      const card = this.createCard(content, index);
      track.appendChild(card);
      this.cards.push(card);
      
      // Create indicator
      const indicator = document.createElement('span');
      indicator.className = 'feed-indicator';
      indicator.dataset.index = index.toString();
      if (index === 0) indicator.classList.add('active');
      indicators.appendChild(indicator);
    });
    
    // Update type filters
    this.updateTypeFilters(shuffled[0]?.type);
  }
  
  private createCard(content: any, index: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.dataset.index = index.toString();
    card.dataset.type = content.type.toLowerCase();
    card.style.setProperty('--card-color', content.color);
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${content.type}: ${content.title}`);
    
    card.innerHTML = `
      <div class="feed-card-header">
        <span class="feed-card-type">${content.type}</span>
        <span class="feed-card-platform">${content.platform}</span>
      </div>
      <div class="feed-card-content">
        <h3 class="feed-card-main">${content.title}</h3>
        <p class="feed-card-insight">${content.insight}</p>
        <div class="feed-card-stats">
          ${content.stats.map((s: any) => `
            <span class="feed-card-stat">
              <span class="feed-card-stat-value">${s.value}</span>
              <span>${s.label}</span>
            </span>
          `).join('')}
        </div>
      </div>
      <div class="feed-card-why">
        <span class="feed-card-why-label">WHY DID THIS MAKE YOU STOP?</span>
        <div class="feed-card-why-factors">
          ${content.whyFactors.map((f: string) => `<span class="feed-card-why-factor">${f}</span>`).join('')}
        </div>
      </div>
    `;
    
    // Add hover/focus handlers for "why did you stop"
    card.addEventListener('mouseenter', () => this.showWhy(card, content.whyFactors));
    card.addEventListener('focusin', () => this.showWhy(card, content.whyFactors));
    
    // Parallax tilt effect
    if (!this.prefersReducedMotion) {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    }
    
    return card;
  }
  
  private showWhy(card: HTMLElement, factors: string[]): void {
    // This is handled by CSS :hover and :focus-within
    // But we can add analytics or sound here
  }
  
  private bindEvents(): void {
    const viewport = this.container.querySelector('.feed-viewport') as HTMLElement;
    const prevBtn = this.container.querySelector('.feed-btn-prev') as HTMLButtonElement;
    const nextBtn = this.container.querySelector('.feed-btn-next') as HTMLButtonElement;
    
    // Button navigation
    prevBtn?.addEventListener('click', () => this.navigate(-1));
    nextBtn?.addEventListener('click', () => this.navigate(1));
    
    // Keyboard navigation
    viewport?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
    
    // Drag/swipe
    if (!this.prefersReducedMotion) {
      viewport?.addEventListener('mousedown', this.onDragStart.bind(this));
      viewport?.addEventListener('touchstart', this.onDragStart.bind(this), { passive: true });
      
      window.addEventListener('mousemove', this.onDragMove.bind(this), { passive: true });
      window.addEventListener('touchmove', this.onDragMove.bind(this), { passive: true });
      
      window.addEventListener('mouseup', this.onDragEnd.bind(this));
      window.addEventListener('touchend', this.onDragEnd.bind(this));
    }
    
    // Type filter clicks
    const typeBtns = Array.from(this.container.querySelectorAll('.feed-type')) as HTMLElement[];
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.filterByType(btn.dataset.type!));
    });
    
    // Auto-advance
    this.startAutoAdvance();
    
    // Pause on hover
    viewport?.addEventListener('mouseenter', () => this.stopAutoAdvance());
    viewport?.addEventListener('mouseleave', () => this.startAutoAdvance());
  }
  
  private onDragStart(e: MouseEvent | TouchEvent): void {
    if (this.prefersReducedMotion) return;
    
    this.isDragging = true;
    this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.currentTranslateX = -this.currentIndex * 100;
    
    const track = this.container.querySelector('.feed-track') as HTMLElement | null;
    if (track) track.style.setProperty('transition', 'none');
  }
  
  private onDragMove(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - this.startX;
    const viewport = this.container.querySelector('.feed-viewport') as HTMLElement | null;
    const viewportWidth = viewport?.offsetWidth || 1;
    const deltaPercent = (deltaX / viewportWidth) * 100;
    
    this.currentTranslateX = -this.currentIndex * 100 + deltaPercent;
    const track = this.container.querySelector('.feed-track') as HTMLElement | null;
    if (track) track.style.transform = `translateX(${this.currentTranslateX}%)`;
  }
  
  private onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const track = this.container.querySelector('.feed-track') as HTMLElement | null;
    if (track) track.style.setProperty('transition', 'transform var(--duration-slow) var(--ease-out)');
    
    const threshold = 30; // percent
    if (this.currentTranslateX < -this.currentIndex * 100 - threshold) {
      this.navigate(1);
    } else if (this.currentTranslateX > -this.currentIndex * 100 + threshold) {
      this.navigate(-1);
    } else {
      this.goTo(this.currentIndex);
    }
  }
  
  private navigate(direction: number): void {
    const newIndex = Math.max(0, Math.min(this.cards.length - 1, this.currentIndex + direction));
    this.goTo(newIndex);
  }
  
  private goTo(index: number): void {
    this.currentIndex = index;
    this.currentTranslateX = -index * 100;
    
    const track = this.container.querySelector('.feed-track') as HTMLElement | null;
    if (track) track.style.transform = `translateX(${this.currentTranslateX}%)`;
    
    this.updateActiveStates();
  }
  
  private updateActiveStates(): void {
    // Cards
    this.cards.forEach((card, i) => {
      card.classList.toggle('active', i === this.currentIndex);
    });
    
    // Indicators
    const indicators = Array.from(this.container.querySelectorAll('.feed-indicator')) as HTMLElement[];
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === this.currentIndex);
    });
    
    // Type filters
    const currentCard = this.cards[this.currentIndex];
    if (currentCard) {
      this.updateTypeFilters(currentCard.dataset.type);
    }
    
    // Buttons
    const prevBtn = this.container.querySelector('.feed-btn-prev') as HTMLButtonElement;
    const nextBtn = this.container.querySelector('.feed-btn-next') as HTMLButtonElement;
    prevBtn!.disabled = this.currentIndex === 0;
    nextBtn!.disabled = this.currentIndex === this.cards.length - 1;
  }
  
  private updateTypeFilters(activeType: string | undefined): void {
    const typeBtns = Array.from(this.container.querySelectorAll('.feed-type')) as HTMLElement[];
    typeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === activeType);
    });
  }
  
  private filterByType(type: string): void {
    const index = this.cards.findIndex(c => c.dataset.type === type);
    if (index !== -1) {
      this.goTo(index);
    }
  }
  
  private getTypeColor(type: string): string {
    const t = contentTypes.find(c => c.type.toLowerCase() === type.toLowerCase());
    return t?.color || '#FF3B30';
  }
  
  private startAutoAdvance(): void {
    if (this.prefersReducedMotion || this.autoAdvanceInterval) return;
    
    this.autoAdvanceInterval = setInterval(() => {
      if (!this.isDragging) {
        const nextIndex = this.currentIndex + 1 >= this.cards.length ? 0 : this.currentIndex + 1;
        this.goTo(nextIndex);
      }
    }, 8000);
  }
  
  private stopAutoAdvance(): void {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'social-feed-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        this.startAutoAdvance();
      },
      onLeave: () => {
        this.stopAutoAdvance();
      },
      onEnterBack: () => {
        this.startAutoAdvance();
      },
      onLeaveBack: () => {
        this.stopAutoAdvance();
      },
    });
  }
  
  destroy(): void {
    this.stopAutoAdvance();
  }
}