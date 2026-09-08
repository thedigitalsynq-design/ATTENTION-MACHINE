export class FinalScreen {
  private container: HTMLElement;
  private isVisible = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="final-screen-overlay" role="document">
        <div class="final-screen-content">
          <div class="final-screen-icon" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 22 12"></polyline>
              <polyline points="22 12 18 8"></polyline>
              <polyline points="22 12 18 16"></polyline>
            </svg>
          </div>
          <h1 class="final-screen-title">SIGNAL RECEIVED.</h1>
          <p class="final-screen-message">
            The internet won't know what's coming.<br>
            <span class="final-screen-delay">Yet.</span>
          </p>
          <div class="final-screen-brand">ATTENTION MACHINE</div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .final-screen {
        position: fixed;
        inset: 0;
        z-index: var(--z-modal);
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--duration-slower) var(--ease-out);
      }
      
      .final-screen.visible {
        opacity: 1;
        pointer-events: auto;
      }
      
      .final-screen-overlay {
        position: absolute;
        inset: 0;
        background: var(--color-black);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--container-padding);
      }
      
      .final-screen-content {
        text-align: center;
        max-width: 600px;
        transform: translateY(40px);
        opacity: 0;
        transition: transform var(--duration-slowest) var(--ease-out), opacity var(--duration-slowest) var(--ease-out);
      }
      
      .final-screen.visible .final-screen-content {
        transform: translateY(0);
        opacity: 1;
      }
      
      .final-screen-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--space-8);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-gray-300);
        border-radius: 50%;
        color: var(--color-accent);
        animation: finalIconPulse 3s var(--ease-in-out) infinite;
      }
      
      @keyframes finalIconPulse {
        0%, 100% { border-color: var(--color-gray-300); box-shadow: 0 0 0 0 transparent; }
        50% { border-color: var(--color-accent); box-shadow: 0 0 40px var(--color-accent-dim); }
      }
      
      .final-screen-title {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--color-white);
        margin-bottom: var(--space-6);
        overflow: hidden;
      }
      
      .final-screen-title .word {
        display: inline-block;
        transform: translateY(100%);
        animation: finalWordReveal 0.8s var(--ease-out) forwards;
      }
      
      @keyframes finalWordReveal {
        to { transform: translateY(0); }
      }
      
      .final-screen-message {
        font-family: var(--font-ui);
        font-size: var(--text-xl);
        line-height: 1.6;
        color: var(--color-gray-500);
        margin-bottom: var(--space-12);
      }
      
      .final-screen-delay {
        color: var(--color-white);
        font-weight: 500;
      }
      
      .final-screen-brand {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--color-gray-400);
        opacity: 0;
        animation: finalBrandFade 1s var(--ease-out) 2s forwards;
      }
      
      @keyframes finalBrandFade {
        to { opacity: 1; }
      }
      
      .final-screen.loading .final-screen-icon {
        animation: finalIconSpin 1s linear infinite;
      }
      
      @keyframes finalIconSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .final-screen.loading .final-screen-title {
        animation: none;
      }
      
      .final-screen.loading .final-screen-message {
        opacity: 0.5;
      }
      
      @media (max-width: 768px) {
        .final-screen-title {
          font-size: var(--text-3xl);
        }
        
        .final-screen-message {
          font-size: var(--text-lg);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  showLoading(): void {
    this.container.classList.add('visible', 'loading');
    this.isVisible = true;
    
    // Reset content for loading state
    const content = this.container.querySelector('.final-screen-content');
    if (content) {
      content.innerHTML = `
        <div class="final-screen-icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
        </div>
        <h1 class="final-screen-title">TRANSMITTING...</h1>
        <p class="final-screen-message">Sending your signal to the machine.</p>
      `;
    }
  }
  
  showSuccess(): void {
    this.container.classList.remove('loading');
    
    const content = this.container.querySelector('.final-screen-content');
    if (content) {
      content.innerHTML = `
        <div class="final-screen-icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="16 12 22 12"></polyline>
            <polyline points="22 12 18 8"></polyline>
            <polyline points="22 12 18 16"></polyline>
          </svg>
        </div>
        <h1 class="final-screen-title"><span class="word">SIGNAL</span> <span class="word">RECEIVED.</span></h1>
        <p class="final-screen-message">
          The internet won't know what's coming.<br>
          <span class="final-screen-delay">Yet.</span>
        </p>
        <div class="final-screen-brand">ATTENTION MACHINE</div>
      `;
      
      // Stagger word animation
      const words = content.querySelectorAll('.word');
      words.forEach((word, index) => {
        (word as HTMLElement).style.animationDelay = `${index * 0.15}s`;
      });
    }
    
    // Auto-hide after delay
    setTimeout(() => {
      this.hide();
    }, 8000);
  }
  
  showError(): void {
    this.container.classList.remove('loading');
    
    const content = this.container.querySelector('.final-screen-content');
    if (content) {
      content.innerHTML = `
        <div class="final-screen-icon" style="color: var(--color-accent);" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1 class="final-screen-title">TRANSMISSION FAILED</h1>
        <p class="final-screen-message">The signal didn't reach us. Try again?</p>
        <button class="btn btn-primary" data-cursor-hover="true" onclick="this.closest('.final-screen').classList.remove('visible')">
          RETRY
        </button>
      `;
    }
  }
  
  hide(): void {
    this.container.classList.remove('visible');
    this.isVisible = false;
    
    setTimeout(() => {
      if (!this.isVisible) {
        const content = this.container.querySelector('.final-screen-content');
        if (content) {
          content.innerHTML = '';
        }
      }
    }, 1000);
  }
  
  destroy(): void {
    this.hide();
  }
}