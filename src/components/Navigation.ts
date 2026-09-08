import type { NavItem } from '../types';
import { getLenis } from '../utils/lenis';

interface NavigationConfig {
  items: readonly NavItem[];
}

export class Navigation {
  private container: HTMLElement;
  private config: NavigationConfig;
  private currentActive: string | null = null;
  private isVisible = true;
  private lastScrollY = 0;
  private hideThreshold = 100;
  
  constructor(container: HTMLElement, items: readonly NavItem[]) {
    this.container = container;
    this.config = { items };
    this.render();
    this.bindEvents();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="nav-inner">
        <div class="nav-logo" data-cursor-hover="true">
          <span class="nav-logo-mark">AM</span>
          <span class="nav-logo-text">ATTENTION MACHINE</span>
        </div>
        <div class="nav-links" role="menubar">
          ${this.config.items.map(item => `
            <a href="${item.href}" 
               class="nav-link" 
               data-section="${item.key}"
               role="menuitem"
               data-cursor-hover="true">
              <span class="nav-link-text">${item.label}</span>
              <span class="nav-link-indicator" aria-hidden="true"></span>
            </a>
          `).join('')}
        </div>
        <div class="nav-controls">
          <button class="nav-sound-toggle btn-ghost" aria-label="Toggle sound" data-cursor-hover="true">
            <svg class="sound-on" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg class="sound-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Add styles
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .navigation {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--nav-height);
        z-index: var(--z-nav);
        background: linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        transform: translateY(0);
        transition: transform var(--duration-base) var(--ease-out), opacity var(--duration-base) var(--ease-out);
      }
      
      .navigation.hidden {
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
      }
      
      .nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 var(--container-padding);
      }
      
      .nav-logo {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        text-decoration: none;
        color: var(--color-white);
      }
      
      .nav-logo-mark {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 700;
        letter-spacing: 0.05em;
        color: var(--color-accent);
      }
      
      .nav-logo-text {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .nav-logo:hover .nav-logo-text {
        color: var(--color-white);
      }
      
      .nav-links {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        border-radius: 2px;
        position: relative;
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .nav-link::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--color-accent);
        opacity: 0;
        border-radius: 2px;
        transition: opacity var(--duration-base) var(--ease-out);
      }
      
      .nav-link:hover {
        color: var(--color-white);
      }
      
      .nav-link:hover::before {
        opacity: 0.1;
      }
      
      .nav-link.active {
        color: var(--color-accent);
      }
      
      .nav-link.active .nav-link-indicator {
        width: 100%;
        opacity: 1;
      }
      
      .nav-link-indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: var(--color-accent);
        width: 0;
        opacity: 0;
        transition: width var(--duration-slow) var(--ease-out), opacity var(--duration-base) var(--ease-out);
      }
      
      .nav-controls {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }
      
      .nav-sound-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        opacity: 0.6;
        transition: opacity var(--duration-base) var(--ease-out), background var(--duration-base) var(--ease-out);
      }
      
      .nav-sound-toggle:hover {
        opacity: 1;
        background: var(--color-gray-200);
      }
      
      @media (max-width: 768px) {
        .nav-logo-text {
          display: none;
        }
        
        .nav-links {
          gap: 0;
        }
        
        .nav-link {
          padding: var(--space-2);
        }
        
        .nav-link-text {
          display: none;
        }
      }
      
      @media (max-width: 480px) {
        .nav-controls {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    // Smooth scroll on click
    this.container.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            const lenis = (window as any).__lenis;
            if (lenis) {
              lenis.scrollTo(target, { offset: -60 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
    
    // Hide/show on scroll
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', this.handleScroll.bind(this));
    } else {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
  }
  
  private handleScroll(e: { scroll: number; direction: number } | Event): void {
    const scrollY = 'scroll' in e ? e.scroll : window.scrollY;
    const direction = 'direction' in e ? e.direction : (scrollY > this.lastScrollY ? 1 : -1);
    
    if (scrollY > this.hideThreshold) {
      if (direction > 0 && this.isVisible) {
        this.hide();
      } else if (direction < 0 && !this.isVisible) {
        this.show();
      }
    } else {
      this.show();
    }
    
    this.lastScrollY = scrollY;
  }
  
  private hide(): void {
    this.isVisible = false;
    this.container.classList.add('hidden');
  }
  
  private show(): void {
    this.isVisible = true;
    this.container.classList.remove('hidden');
  }
  
  setActive(sectionKey: string): void {
    if (this.currentActive === sectionKey) return;
    
    this.currentActive = sectionKey;
    
    this.container.querySelectorAll('.nav-link').forEach(link => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === sectionKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  destroy(): void {
    // Cleanup handled by parent
  }
}