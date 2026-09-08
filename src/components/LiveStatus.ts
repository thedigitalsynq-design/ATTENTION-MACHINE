const statusMessages = [
  'CURRENTLY MAKING SOMETHING',
  'ANALYZING CULTURE SHIFTS',
  'DETECTING ATTENTION PATTERNS',
  'OPTIMIZING FOR SHAREABILITY',
  'BUILDING THE NEXT THING',
  'LISTENING TO THE INTERNET',
  'REVERSE-ENGINEERING VIRALITY',
  'DESIGNING FOR HUMANS',
  'QUESTIONING THE OBVIOUS',
  'REFUSING BORING',
];

export class LiveStatus {
  private container: HTMLElement;
  private currentIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isVisible = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.startRotation();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="live-status-inner">
        <span class="live-indicator" aria-hidden="true"></span>
        <span class="live-text">${statusMessages[0]}</span>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .live-status {
        position: fixed;
        bottom: var(--space-6);
        right: var(--container-padding);
        z-index: var(--z-ui);
        pointer-events: none;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
      }
      
      .live-status.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .live-status-inner {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid var(--color-gray-200);
        border-radius: 100px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .live-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-accent);
        animation: liveBlink 2s var(--ease-in-out) infinite;
      }
      
      @keyframes liveBlink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.8); }
      }
      
      .live-text {
        white-space: nowrap;
        transition: opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out);
      }
      
      .live-status.updating .live-text {
        opacity: 0;
        transform: translateY(-10px);
      }
      
      @media (max-width: 768px) {
        .live-status {
          bottom: calc(var(--space-6) + 60px);
          right: var(--space-4);
          left: var(--space-4);
        }
        
        .live-status-inner {
          width: 100%;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private startRotation(): void {
    // Show after initial delay
    setTimeout(() => {
      this.container.classList.add('visible');
      this.isVisible = true;
    }, 3000);
    
    // Rotate messages
    this.intervalId = setInterval(() => {
      this.rotateMessage();
    }, 8000);
  }
  
  private rotateMessage(): void {
    if (!this.isVisible) return;
    
    const textElement = this.container.querySelector('.live-text') as HTMLElement;
    if (!textElement) return;
    
    this.container.classList.add('updating');
    
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % statusMessages.length;
      textElement.textContent = statusMessages[this.currentIndex];
      this.container.classList.remove('updating');
    }, 300);
  }
  
  setMessage(message: string): void {
    const textElement = this.container.querySelector('.live-text') as HTMLElement;
    if (textElement) {
      this.container.classList.add('updating');
      setTimeout(() => {
        textElement.textContent = message;
        this.container.classList.remove('updating');
      }, 300);
    }
  }
  
  show(): void {
    this.container.classList.add('visible');
    this.isVisible = true;
  }
  
  hide(): void {
    this.container.classList.remove('visible');
    this.isVisible = false;
  }
  
  destroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}