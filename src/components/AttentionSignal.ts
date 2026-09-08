interface SignalState {
  level: number;
  isMaxed: boolean;
  currentSection: string | null;
}

export class AttentionSignal {
  private container: HTMLElement;
  private state: SignalState = {
    level: 0,
    isMaxed: false,
    currentSection: null,
  };
  private pulseTimeout: ReturnType<typeof setTimeout> | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="attention-signal-inner">
        <div class="signal-dot" aria-hidden="true"></div>
        <span class="signal-text">LIVE</span>
        <div class="signal-meter" aria-hidden="true">
          <div class="signal-meter-fill"></div>
        </div>
        <span class="signal-level" aria-live="polite">0%</span>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .attention-signal {
        position: fixed;
        bottom: var(--space-6);
        left: var(--container-padding);
        z-index: var(--z-ui);
        pointer-events: none;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
      }
      
      .attention-signal.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .attention-signal-inner {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-4);
        background: rgba(10, 10, 10, 0.8);
        border: 1px solid var(--color-gray-300);
        border-radius: 100px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
      }
      
      .signal-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-gray-500);
        animation: signalPulse 2s var(--ease-in-out) infinite;
      }
      
      .attention-signal.active .signal-dot {
        background: var(--color-accent);
        animation: signalPulseActive 1s var(--ease-in-out) infinite;
      }
      
      .attention-signal.maxed .signal-dot {
        animation: signalPulseMaxed 0.5s var(--ease-in-out) infinite;
        box-shadow: 0 0 20px var(--color-accent-glow);
      }
      
      @keyframes signalPulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes signalPulseActive {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }
      
      @keyframes signalPulseMaxed {
        0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px var(--color-accent-glow); }
        50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 30px var(--color-accent-glow); }
      }
      
      .signal-text {
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .attention-signal.active .signal-text {
        color: var(--color-white);
      }
      
      .attention-signal.maxed .signal-text {
        color: var(--color-accent);
        animation: signalTextFlash 0.5s var(--ease-in-out) infinite;
      }
      
      @keyframes signalTextFlash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .signal-meter {
        width: 60px;
        height: 4px;
        background: var(--color-gray-200);
        border-radius: 2px;
        overflow: hidden;
      }
      
      .signal-meter-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
        border-radius: 2px;
        transition: width var(--duration-slow) var(--ease-out);
      }
      
      .signal-level {
        min-width: 36px;
        text-align: right;
        color: var(--color-gray-500);
        font-variant-numeric: tabular-nums;
      }
      
      .attention-signal.active .signal-level {
        color: var(--color-white);
      }
      
      .attention-signal.maxed .signal-level {
        color: var(--color-accent);
      }
      
      @media (max-width: 768px) {
        .attention-signal {
          bottom: var(--space-4);
          left: var(--space-4);
          right: var(--space-4);
        }
        
        .attention-signal-inner {
          width: 100%;
          justify-content: space-between;
        }
        
        .signal-meter {
          flex: 1;
          max-width: 120px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  pulse(section: string): void {
    this.state.currentSection = section;
    this.container.classList.add('visible', 'active');
    
    // Update level based on section progress
    const sectionIndex = ['enter', 'interrupt', 'discover', 'create', 'amplify', 'measure', 'remember', 'connect'].indexOf(section);
    if (sectionIndex !== -1) {
      const newLevel = Math.min(100, Math.round(((sectionIndex + 1) / 8) * 100));
      this.setLevel(newLevel);
    }
    
    // Remove active state after delay
    if (this.pulseTimeout) clearTimeout(this.pulseTimeout);
    this.pulseTimeout = setTimeout(() => {
      this.container.classList.remove('active');
    }, 2000);
  }
  
  setLevel(level: number): void {
    this.state.level = Math.max(0, Math.min(100, level));
    this.state.isMaxed = this.state.level >= 100;
    
    const fill = this.container.querySelector('.signal-meter-fill') as HTMLElement;
    const levelText = this.container.querySelector('.signal-level') as HTMLElement;
    
    if (fill) {
      fill.style.width = `${this.state.level}%`;
    }
    
    if (levelText) {
      levelText.textContent = `${this.state.level}%`;
    }
    
    this.container.classList.toggle('maxed', this.state.isMaxed);
    
    if (this.state.isMaxed) {
      this.container.classList.add('visible', 'active', 'maxed');
    }
  }
  
  getLevel(): number {
    return this.state.level;
  }
  
  increment(amount: number): void {
    this.setLevel(this.state.level + amount);
  }
  
  destroy(): void {
    if (this.pulseTimeout) clearTimeout(this.pulseTimeout);
  }
}