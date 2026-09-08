import { agencyConfig } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';
import { random, lerp } from '../utils/helpers';

const fragments = [
  { type: 'word', content: 'VIRAL', weight: 1 },
  { type: 'word', content: 'CULTURE', weight: 1 },
  { type: 'word', content: 'ATTENTION', weight: 2 },
  { type: 'word', content: 'STOP', weight: 2 },
  { type: 'word', content: 'WATCH', weight: 1 },
  { type: 'word', content: 'FEEL', weight: 1 },
  { type: 'word', content: 'SHARE', weight: 2 },
  { type: 'word', content: 'REMEMBER', weight: 1 },
  { type: 'word', content: 'TREND', weight: 1 },
  { type: 'word', content: 'MEME', weight: 1 },
  { type: 'number', content: '2.1B+', weight: 1 },
  { type: 'number', content: '87%', weight: 1 },
  { type: 'number', content: '340%', weight: 1 },
  { type: 'number', content: '12.4M', weight: 1 },
  { type: 'comment', content: '"this actually made me stop scrolling"', weight: 1 },
  { type: 'comment', content: '"wait, is this an ad?"', weight: 1 },
  { type: 'comment', content: '"the comment section IS the campaign"', weight: 1 },
  { type: 'concept', content: 'ANTI-LAUNCH', weight: 1 },
  { type: 'concept', content: 'COMMENT-FIRST', weight: 1 },
  { type: 'concept', content: 'TREND CREATION', weight: 1 },
  { type: 'concept', content: 'CULTURE HACKING', weight: 1 },
];

export class Hero {
  private container: HTMLElement;
  private fragments: HTMLElement[] = [];
  private animationFrame: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private prefersReducedMotion = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.initFragments();
    this.bindEvents();
    this.startAnimation();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="hero-inner">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-grid" aria-hidden="true"></div>
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-content">
          <div class="hero-headline">
            <h1 class="hero-line hero-line-1">
              <span class="word" data-glitch="WE DON'T">WE DON'T</span>
            </h1>
            <h1 class="hero-line hero-line-2">
              <span class="word">CHASE</span> <span class="word accent-word" data-glitch="ATTENTION.">ATTENTION.</span>
            </h1>
            <h1 class="hero-line hero-line-3">
              <span class="word">WE</span> <span class="word">DESIGN</span> <span class="word accent-word" data-glitch="IT.">IT.</span>
            </h1>
          </div>
          <div class="hero-fragments" aria-hidden="true"></div>
          <div class="hero-instruction" data-cursor-hover="true">
            <span class="instruction-text">MOVE YOUR CURSOR</span>
            <svg class="instruction-mouse" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"></rect>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
          </div>
          <div class="hero-scroll-indicator" data-cursor-hover="true">
            <span class="scroll-text">NOW SCROLL</span>
            <svg class="scroll-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M12 5v14"></path>
              <path d="M19 12l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-enter {
        position: relative;
        min-height: 100vh;
        min-height: 100svh;
      }
      
      .hero-inner {
        position: relative;
        width: 100%;
        height: 100vh;
        height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .hero-bg {
        position: absolute;
        inset: 0;
        background: 
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,59,48,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,59,48,0.05) 0%, transparent 60%),
          var(--color-black);
        opacity: 0;
        animation: heroBgFade 1.5s var(--ease-out) 0.5s forwards;
      }
      
      .hero-grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,59,48,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,59,48,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
        opacity: 0;
        animation: heroBgFade 2s var(--ease-out) 0.8s forwards, gridPulse 8s ease-in-out infinite 2s;
        mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
      }
      
      @keyframes gridPulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
      }
      
      .hero-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(255,59,48,0.12) 0%, transparent 70%);
        opacity: 0;
        animation: heroBgFade 3s var(--ease-out) 1s forwards, orbPulse 6s ease-in-out infinite 2s;
        pointer-events: none;
      }
      
      @keyframes heroBgFade {
        to { opacity: 1; }
      }
      
      .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--container-padding);
      }
      
      .hero-headline {
        margin-bottom: var(--space-12);
      }
      
      .hero-line {
        font-family: var(--font-display);
        font-size: var(--text-5xl);
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--color-white);
        overflow: hidden;
        margin-bottom: var(--space-2);
      }
      
      .hero-line .word {
        display: inline-block;
        transform: translateY(100%);
        opacity: 0;
        animation: wordReveal 1s var(--ease-out) forwards;
      }
      
      .hero-line-1 .word { animation-delay: 0.8s; }
      .hero-line-2 .word:nth-child(1) { animation-delay: 1s; }
      .hero-line-2 .word:nth-child(2) { animation-delay: 1.15s; }
      .hero-line-3 .word:nth-child(1) { animation-delay: 1.3s; }
      .hero-line-3 .word:nth-child(2) { animation-delay: 1.4s; }
      .hero-line-3 .word:nth-child(3) { animation-delay: 1.5s; }
      
      @keyframes wordReveal {
        to { transform: translateY(0); opacity: 1; }
      }
      
      .hero-line-2 .word:nth-child(2),
      .hero-line-3 .word:last-child {
        color: var(--color-accent);
      }
      
      /* Glitch text effect */
      .accent-word {
        position: relative;
      }
      
      .accent-word::before,
      .accent-word::after {
        content: attr(data-glitch);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      
      .accent-word::before {
        color: #00ffff;
        animation: glitchBefore 4s infinite;
        clip-path: inset(0 0 65% 0);
      }
      
      .accent-word::after {
        color: #ff00ff;
        animation: glitchAfter 4s infinite;
        clip-path: inset(65% 0 0 0);
      }
      
      @keyframes glitchBefore {
        0%, 90%, 100% { opacity: 0; transform: translate(0); }
        91% { opacity: 0.8; transform: translate(-3px, -1px); }
        93% { opacity: 0; transform: translate(0); }
        95% { opacity: 0.6; transform: translate(2px, 1px); }
        97% { opacity: 0; transform: translate(0); }
      }
      
      @keyframes glitchAfter {
        0%, 92%, 100% { opacity: 0; transform: translate(0); }
        93% { opacity: 0.7; transform: translate(3px, 1px); }
        95% { opacity: 0; transform: translate(0); }
        96% { opacity: 0.5; transform: translate(-2px, -1px); }
        98% { opacity: 0; transform: translate(0); }
      }
      
      .hero-fragments {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
      }
      
      .hero-fragment {
        position: absolute;
        font-family: var(--font-display);
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        user-select: none;
        transition: transform var(--duration-slow) var(--ease-out), opacity var(--duration-slow) var(--ease-out);
      }
      
      .hero-fragment.word {
        font-size: clamp(0.75rem, 1.5vw, 1.5rem);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-white);
        opacity: 0.15;
      }
      
      .hero-fragment.number {
        font-family: var(--font-mono);
        font-size: clamp(1rem, 2vw, 2rem);
        font-weight: 600;
        color: var(--color-accent);
        opacity: 0.2;
      }
      
      .hero-fragment.comment {
        font-family: var(--font-ui);
        font-size: clamp(0.75rem, 1.2vw, 1rem);
        font-style: italic;
        color: var(--color-gray-500);
        opacity: 0.15;
        max-width: 300px;
      }
      
      .hero-fragment.concept {
        font-size: clamp(0.75rem, 1.3vw, 1.25rem);
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-accent);
        opacity: 0.1;
        border: 1px solid currentColor;
        padding: var(--space-1) var(--space-3);
        border-radius: 2px;
      }
      
      .hero-instruction {
        position: absolute;
        bottom: var(--space-10);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        opacity: 0;
        animation: instructionFade 1s var(--ease-out) 2.5s forwards;
        pointer-events: none;
        z-index: 10;
      }
      
      .hero-instruction.visible {
        pointer-events: auto;
      }
      
      @keyframes instructionFade {
        to { opacity: 1; }
      }
      
      .instruction-mouse {
        animation: mouseFloat 2s var(--ease-in-out) infinite;
      }
      
      @keyframes mouseFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      
      .hero-scroll-indicator {
        position: absolute;
        bottom: var(--space-6);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        opacity: 0;
        animation: scrollIndicatorFade 1s var(--ease-out) 3.5s forwards;
        pointer-events: none;
        z-index: 10;
      }
      
      .hero-scroll-indicator.visible {
        pointer-events: auto;
      }
      
      @keyframes scrollIndicatorFade {
        to { opacity: 1; }
      }
      
      .scroll-arrow {
        animation: scrollArrowBounce 2s var(--ease-in-out) infinite;
      }
      
      @keyframes scrollArrowBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
      
      @media (max-width: 768px) {
        .hero-line {
          font-size: var(--text-3xl);
        }
        
        .hero-instruction,
        .hero-scroll-indicator {
          font-size: 0.625rem;
        }
      }
      
      @media (max-width: 480px) {
        .hero-line {
          font-size: var(--text-2xl);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private initFragments(): void {
    const fragmentsContainer = this.container.querySelector('.hero-fragments') as HTMLElement;
    if (!fragmentsContainer) return;
    
    // Create fragment elements
    fragments.forEach((fragment, index) => {
      const el = document.createElement('span');
      el.className = `hero-fragment ${fragment.type}`;
      el.textContent = fragment.content;
      el.dataset.index = index.toString();
      fragmentsContainer.appendChild(el);
      this.fragments.push(el);
    });
    
    // Initial random positions
    this.fragments.forEach(fragment => {
      this.positionFragment(fragment, true);
    });
  }
  
  private positionFragment(fragment: HTMLElement, initial = false): void {
    const rect = this.container.getBoundingClientRect();
    const fragRect = fragment.getBoundingClientRect();
    
    const padding = 100;
    const x = random(padding, rect.width - fragRect.width - padding);
    const y = random(padding, rect.height - fragRect.height - padding);
    
    if (initial) {
      fragment.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      fragment.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    fragment.style.opacity = fragment.classList.contains('concept') ? '0.1' : 
                              fragment.classList.contains('number') ? '0.2' : '0.15';
  }
  
  private bindEvents(): void {
    if (this.prefersReducedMotion) return;
    
    this.container.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX - this.container.getBoundingClientRect().left;
      this.mouseY = e.clientY - this.container.getBoundingClientRect().top;
    });
    
    // Scroll indicator interaction
    const scrollIndicator = this.container.querySelector('.hero-scroll-indicator');
    let hasScrolled = false;
    
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) {
        hasScrolled = true;
        scrollIndicator?.classList.add('visible');
        this.container.querySelector('.hero-instruction')?.classList.add('visible');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup on section leave
    createScrollTrigger({
      id: 'hero-cleanup',
      element: this.container.closest('.section')!,
      start: 'bottom top',
      onLeave: () => {
        window.removeEventListener('scroll', handleScroll);
        this.stopAnimation();
      },
      onEnterBack: () => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        this.startAnimation();
      },
    });
  }
  
  private startAnimation(): void {
    if (this.prefersReducedMotion || this.animationFrame) return;
    
    let lastTime = 0;
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Subtle fragment movement
      this.fragments.forEach((fragment, index) => {
        if (index % 3 === 0) {
          const currentTransform = fragment.style.transform;
          const match = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
          if (match) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            
            // Very subtle drift
            const driftX = Math.sin(time * 0.0002 + index) * 0.5;
            const driftY = Math.cos(time * 0.00015 + index) * 0.5;
            
            fragment.style.transform = `translate(${x + driftX}px, ${y + driftY}px)`;
          }
        }
      });
      
      // Mouse attraction (very subtle)
      if (this.mouseX || this.mouseY) {
        this.fragments.forEach((fragment, index) => {
          if (index % 5 === 0) {
            const currentTransform = fragment.style.transform;
            const match = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              const fragRect = fragment.getBoundingClientRect();
              const fragCenterX = x + fragRect.width / 2;
              const fragCenterY = y + fragRect.height / 2;
              
              const dx = this.mouseX - fragCenterX;
              const dy = this.mouseY - fragCenterY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 300 && dist > 0) {
                const force = (300 - dist) / 300 * 0.02;
                fragment.style.transform = `translate(${x - dx * force}px, ${y - dy * force}px)`;
              }
            }
          }
        });
      }
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }
  
  private stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  destroy(): void {
    this.stopAnimation();
  }
}