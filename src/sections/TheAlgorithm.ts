import { createScrollTrigger } from '../utils/scrollTriggers';

const algorithmStages = [
  { id: 'content', label: 'CONTENT', description: 'The raw material. What you make.', icon: '◈' },
  { id: 'attention', label: 'ATTENTION', description: 'Someone stops. The first win.', icon: '▲' },
  { id: 'retention', label: 'RETENTION', description: 'They stay. The real signal.', icon: '■' },
  { id: 'engagement', label: 'ENGAGEMENT', description: 'They react. Comment, share, save.', icon: '◆' },
  { id: 'sharing', label: 'SHARING', description: 'They pass it on. Organic reach.', icon: '▼' },
  { id: 'discovery', label: 'DISCOVERY', description: 'The algorithm notices. Distribution.', icon: '●' },
  { id: 'conversion', label: 'CONVERSION', description: 'Action taken. Business result.', icon: '★' },
];

export class TheAlgorithm {
  private container: HTMLElement;
  private activeStage = 0;
  private prefersReducedMotion = false;
  private animationFrame: number | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.bindEvents();
    this.startAnimation();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="algorithm-inner">
        <header class="algorithm-header">
          <h2 class="algorithm-title" id="algorithm-heading">
            <span class="title-word">THE</span>
            <span class="title-word">ALGORITHM</span>
          </h2>
          <p class="algorithm-subtitle">We don't hack the algorithm. We make people care.</p>
        </header>
        
        <div class="algorithm-flow" role="list" aria-label="Algorithm stages">
          ${algorithmStages.map((stage, index) => `
            <article class="algorithm-stage" data-stage="${stage.id}" data-index="${index}" role="listitem">
              <div class="stage-visual" aria-hidden="true">
                <span class="stage-icon">${stage.icon}</span>
                <div class="stage-pulse"></div>
                <div class="stage-orbit"></div>
              </div>
              <div class="stage-content">
                <h3 class="stage-label">${stage.label}</h3>
                <p class="stage-description">${stage.description}</p>
              </div>
              <div class="stage-connector" aria-hidden="true"></div>
            </article>
          `).join('')}
        </div>
        
        <div class="algorithm-conclusion">
          <p class="conclusion-line conclusion-line-1">WE DON'T</p>
          <p class="conclusion-line conclusion-line-2">HACK THE ALGORITHM.</p>
          <p class="conclusion-line conclusion-line-3">WE MAKE</p>
          <p class="conclusion-line conclusion-line-4">PEOPLE CARE.</p>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-algorithm {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        background: var(--color-black);
      }
      
      .algorithm-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .algorithm-header {
        text-align: center;
        margin-bottom: var(--space-10);
      }
      
      .algorithm-title {
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
      
      .algorithm-title .title-word {
        display: block;
      }
      
      .algorithm-title .title-word:last-child {
        color: var(--color-accent);
      }
      
      .algorithm-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .algorithm-flow {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        margin-bottom: var(--space-16);
      }
      
      .algorithm-stage {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--space-6);
        padding: var(--space-6);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        opacity: 0;
        transform: translateX(-40px);
        transition: all var(--duration-slow) var(--ease-out);
      }
      
      .algorithm-stage.active {
        opacity: 1;
        transform: translateX(0);
        border-color: var(--color-accent);
        background: var(--color-black);
      }
      
      .algorithm-stage.completed {
        opacity: 1;
        transform: translateX(0);
        border-color: var(--color-gray-400);
      }
      
      .stage-visual {
        position: relative;
        width: 80px;
        height: 80px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .stage-icon {
        position: relative;
        z-index: 2;
        font-size: var(--text-2xl);
        color: var(--color-gray-500);
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .algorithm-stage.active .stage-icon {
        color: var(--color-accent);
      }
      
      .algorithm-stage.completed .stage-icon {
        color: var(--color-gray-400);
      }
      
      .stage-pulse {
        position: absolute;
        inset: 0;
        border: 2px solid var(--color-accent);
        border-radius: 50%;
        opacity: 0;
        animation: stagePulse 2s var(--ease-out) infinite;
      }
      
      .algorithm-stage.active .stage-pulse {
        opacity: 1;
      }
      
      @keyframes stagePulse {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      
      .stage-orbit {
        position: absolute;
        inset: -8px;
        border: 1px solid var(--color-accent);
        border-radius: 50%;
        opacity: 0;
        animation: stageOrbit 4s linear infinite;
      }
      
      .algorithm-stage.active .stage-orbit {
        opacity: 0.3;
      }
      
      @keyframes stageOrbit {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .stage-content {
        flex: 1;
        min-width: 0;
      }
      
      .stage-label {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .algorithm-stage.active .stage-label {
        color: var(--color-white);
      }
      
      .algorithm-stage.completed .stage-label {
        color: var(--color-gray-400);
      }
      
      .stage-description {
        font-size: var(--text-base);
        line-height: 1.6;
        color: var(--color-gray-500);
        margin-top: var(--space-1);
      }
      
      .stage-connector {
        position: absolute;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 2px;
        background: var(--color-gray-300);
      }
      
      .stage-connector::before {
        content: '';
        position: absolute;
        right: -4px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border: 2px solid var(--color-gray-300);
        border-radius: 50%;
        background: var(--color-black);
      }
      
      .algorithm-stage:last-child .stage-connector {
        display: none;
      }
      
      .algorithm-conclusion {
        text-align: center;
        padding: var(--space-12);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
      }
      
      .conclusion-line {
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
        opacity: 0;
        transform: translateY(30px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
      }
      
      .conclusion-line-1,
      .conclusion-line-2 {
        font-size: var(--text-3xl);
        color: var(--color-white);
      }
      
      .conclusion-line-3,
      .conclusion-line-4 {
        font-size: var(--text-4xl);
        color: var(--color-accent);
      }
      
      .conclusion-line.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      @media (max-width: 768px) {
        .algorithm-title {
          font-size: var(--text-2xl);
        }
        
        .algorithm-stage {
          flex-direction: column;
          text-align: center;
          gap: var(--space-4);
        }
        
        .stage-visual {
          width: 60px;
          height: 60px;
        }
        
        .stage-connector {
          display: none;
        }
        
        .conclusion-line-1,
        .conclusion-line-2 {
          font-size: var(--text-2xl);
        }
        
        .conclusion-line-3,
        .conclusion-line-4 {
          font-size: var(--text-3xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    const stages = Array.from(this.container.querySelectorAll('.algorithm-stage')) as HTMLElement[];
    stages.forEach(stage => {
      stage.addEventListener('mouseenter', () => this.activateStage(parseInt(stage.dataset.index!)));
      stage.addEventListener('focusin', () => this.activateStage(parseInt(stage.dataset.index!)));
    });
  }
  
  private activateStage(index: number): void {
    this.activeStage = index;
    
    const stages = Array.from(this.container.querySelectorAll('.algorithm-stage')) as HTMLElement[];
    stages.forEach((stage, i) => {
      stage.classList.remove('active', 'completed');
      if (i < index) {
        stage.classList.add('completed');
      } else if (i === index) {
        stage.classList.add('active');
      }
    });
  }
  
  private startAnimation(): void {
    if (this.prefersReducedMotion) {
      // Show all immediately
      const stages = Array.from(this.container.querySelectorAll('.algorithm-stage')) as HTMLElement[];
      stages.forEach((stage, i) => {
        stage.style.opacity = '1';
        stage.style.transform = 'translateX(0)';
        if (i === 0) stage.classList.add('active');
      });
      this.showConclusion();
      return;
    }
    
    // Stagger entrance
    const stages = Array.from(this.container.querySelectorAll('.algorithm-stage')) as HTMLElement[];
    stages.forEach((stage, i) => {
      setTimeout(() => {
        stage.style.opacity = '1';
        stage.style.transform = 'translateX(0)';
        if (i === 0) stage.classList.add('active');
      }, i * 400);
    });
    
    // Auto-advance stages
    let currentIndex = 0;
    const stageElements = stages;
    
    const advanceStage = () => {
      if (this.prefersReducedMotion) return;
      
      currentIndex = (currentIndex + 1) % stageElements.length;
      this.activateStage(currentIndex);
    };
    
    // Auto-advance every 3 seconds
    setInterval(advanceStage, 3000);
  }
  
  private showConclusion(): void {
    const lines = Array.from(this.container.querySelectorAll('.conclusion-line')) as HTMLElement[];
    
    if (this.prefersReducedMotion) {
      lines.forEach(line => line.classList.add('visible'));
      return;
    }
    
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, i * 400 + 3000);
    });
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'algorithm-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        this.showConclusion();
      },
    });
  }
  
  destroy(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}