import { toolboxTools } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

export class Toolbox {
  private container: HTMLElement;
  private activeTool: string | null = null;
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
      <div class="toolbox-inner">
        <header class="toolbox-header">
          <h2 class="toolbox-title" id="create-heading">
            <span class="title-word">THE</span>
            <span class="title-word">TOOLBOX</span>
          </h2>
          <p class="toolbox-subtitle">Select a tool to see how we work. Each one transforms the environment.</p>
        </header>
        
        <div class="toolbox-grid" role="list" aria-label="Available tools">
          ${toolboxTools.map(tool => `
            <button class="toolbox-tool" 
                    data-tool="${tool.id}" 
                    role="listitem"
                    data-cursor-hover="true"
                    style="--tool-color: ${tool.color};">
              <span class="tool-icon">${tool.icon}</span>
              <span class="tool-name">${tool.name}</span>
              <span class="tool-description">${tool.description}</span>
              <span class="tool-indicator" aria-hidden="true"></span>
            </button>
          `).join('')}
        </div>
        
        <div class="toolbox-detail" aria-live="polite">
          <div class="detail-placeholder">
            <span class="placeholder-text">SELECT A TOOL ABOVE TO REVEAL ITS CAPABILITIES</span>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-create {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .toolbox-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      .toolbox-header {
        text-align: center;
        margin-bottom: var(--space-10);
      }
      
      .toolbox-title {
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
      
      .toolbox-title .title-word {
        display: block;
      }
      
      .toolbox-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
        max-width: 600px;
        margin: 0 auto;
      }
      
      .toolbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-12);
      }
      
      .toolbox-tool {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-6);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        text-align: left;
        transition: all var(--duration-base) var(--ease-out);
        overflow: hidden;
      }
      
      .toolbox-tool::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--tool-color);
        opacity: 0;
        transition: opacity var(--duration-base) var(--ease-out);
      }
      
      .toolbox-tool:hover {
        border-color: var(--tool-color);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      
      .toolbox-tool:hover::before {
        opacity: 0.05;
      }
      
      .toolbox-tool.active {
        border-color: var(--tool-color);
        background: var(--color-black);
      }
      
      .toolbox-tool.active::before {
        opacity: 0.1;
      }
      
      .tool-icon {
        font-size: var(--text-2xl);
        line-height: 1;
      }
      
      .tool-name {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--color-white);
      }
      
      .tool-description {
        font-family: var(--font-ui);
        font-size: var(--text-sm);
        line-height: 1.6;
        color: var(--color-gray-500);
      }
      
      .tool-indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--tool-color);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--duration-slow) var(--ease-out);
      }
      
      .toolbox-tool.active .tool-indicator {
        transform: scaleX(1);
      }
      
      .toolbox-tool:hover .tool-indicator {
        transform: scaleX(1);
      }
      
      .toolbox-detail {
        flex: 1;
        min-height: 300px;
        position: relative;
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .detail-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 300px;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .tool-detail-content {
        position: absolute;
        inset: 0;
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out);
      }
      
      .tool-detail-content.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .detail-header {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-6);
        border-bottom: 1px solid var(--color-gray-200);
      }
      
      .detail-icon {
        font-size: var(--text-3xl);
      }
      
      .detail-title {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--color-white);
      }
      
      .detail-description {
        font-size: var(--text-lg);
        line-height: 1.6;
        color: var(--color-gray-400);
        margin-bottom: var(--space-8);
        flex: 1;
      }
      
      .detail-capabilities {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
      }
      
      .capability {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4);
        background: var(--color-black);
        border: 1px solid var(--color-gray-300);
        border-radius: 2px;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .capability:hover {
        border-color: var(--tool-color);
      }
      
      .capability-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        color: var(--tool-color);
      }
      
      .capability-text {
        font-family: var(--font-ui);
        font-size: var(--text-sm);
        line-height: 1.5;
        color: var(--color-white);
      }
      
      .detail-visual {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--duration-slow) var(--ease-out);
      }
      
      .detail-visual.visible {
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .toolbox-title {
          font-size: var(--text-2xl);
        }
        
        .toolbox-grid {
          grid-template-columns: 1fr;
        }
        
        .detail-capabilities {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    const tools = Array.from(this.container.querySelectorAll('.toolbox-tool')) as HTMLElement[];
    tools.forEach(btn => {
      btn.addEventListener('click', () => this.activateTool(btn.dataset.tool!));
      btn.addEventListener('mouseenter', () => this.previewTool(btn.dataset.tool!));
    });
    
    this.container.addEventListener('mouseleave', () => {
      if (this.activeTool) {
        this.showToolDetail(this.activeTool);
      } else {
        this.showPlaceholder();
      }
    });
  }
  
  private activateTool(toolId: string): void {
    this.activeTool = toolId;
    
    // Update button states
    const tools = Array.from(this.container.querySelectorAll('.toolbox-tool')) as HTMLElement[];
    tools.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === toolId);
    });
    
    this.showToolDetail(toolId);
  }
  
  private previewTool(toolId: string): void {
    if (this.activeTool) return;
    this.showToolDetail(toolId, true);
  }
  
  private showToolDetail(toolId: string, isPreview = false): void {
    const tool = toolboxTools.find(t => t.id === toolId);
    if (!tool) return;
    
    const detailContainer = this.container.querySelector('.toolbox-detail') as HTMLElement;
    const placeholder = detailContainer.querySelector('.detail-placeholder') as HTMLElement | null;
    let content = detailContainer.querySelector('.tool-detail-content') as HTMLElement | null;
    
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    if (!content) {
      content = document.createElement('div');
      content.className = 'tool-detail-content';
      detailContainer.appendChild(content);
    }
    
    const capabilities = this.getToolCapabilities(toolId);
    
    content.innerHTML = `
      <div class="detail-header">
        <span class="detail-icon" style="color: ${tool.color};">${tool.icon}</span>
        <h3 class="detail-title">${tool.name}</h3>
      </div>
      <p class="detail-description">${tool.description}</p>
      <div class="detail-capabilities">
        ${capabilities.map(c => `
          <div class="capability">
            <svg class="capability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="capability-text">${c}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    // Force reflow then animate
    content.offsetHeight;
    content.classList.add('visible');
    
    // Show visual for active tool
    if (!isPreview) {
      this.showToolVisual(toolId);
    }
  }
  
  private showPlaceholder(): void {
    const detailContainer = this.container.querySelector('.toolbox-detail') as HTMLElement;
    const placeholder = detailContainer.querySelector('.detail-placeholder') as HTMLElement | null;
    const content = detailContainer.querySelector('.tool-detail-content') as HTMLElement | null;
    const visual = detailContainer.querySelector('.detail-visual') as HTMLElement | null;
    
    if (content) {
      content.classList.remove('visible');
      setTimeout(() => content.remove(), 300);
    }
    
    if (visual) {
      visual.classList.remove('visible');
    }
    
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }
  
  private getToolCapabilities(toolId: string): string[] {
    const capabilities: Record<string, string[]> = {
      strategy: [
        'Audience intelligence & segmentation',
        'Cultural forecasting & trend mapping',
        'Brand positioning & differentiation',
        'Platform architecture & strategy',
        'Competitive landscape analysis',
      ],
      creative: [
        'Campaign concept development',
        'Brand identity systems',
        'Art direction & visual language',
        'Creative systems & templates',
        'Sonic & motion branding',
      ],
      content: [
        'Content strategy & editorial calendars',
        'Format development & optimization',
        'Series & franchise creation',
        'UGC strategy & moderation',
        'Content supply chain design',
      ],
      video: [
        'Short-form video production',
        'Long-form & documentary',
        'Motion design & animation',
        'Post-production & VFX',
        'Live & real-time content',
      ],
      creators: [
        'Creator identification & vetting',
        'Relationship management',
        'Co-creation programs',
        'Community architecture',
        'Creator equity models',
      ],
      'paid-media': [
        'Performance creative development',
        'Media buying & optimization',
        'Attribution modeling',
        'Creative testing frameworks',
        'Budget allocation strategy',
      ],
      community: [
        'Community strategy & governance',
        'Discord/Slack architecture',
        'Moderation & safety systems',
        'Event & experience design',
        'Loyalty & advocacy programs',
      ],
      data: [
        'Analytics & insights dashboards',
        'Predictive modeling',
        'Creative performance testing',
        'Audience behavior analysis',
        'ROI attribution & reporting',
      ],
    };
    
    return capabilities[toolId] || [];
  }
  
  private showToolVisual(toolId: string): void {
    const detailContainer = this.container.querySelector('.toolbox-detail') as HTMLElement;
    let visual = detailContainer.querySelector('.detail-visual') as HTMLElement;
    
    if (!visual) {
      visual = document.createElement('div');
      visual.className = 'detail-visual';
      detailContainer.appendChild(visual);
    }
    
    // Create unique visual for each tool
    const visuals: Record<string, string> = {
      strategy: '<div class="visual-strategy"><div class="strategy-nodes"></div></div>',
      creative: '<div class="visual-creative"><div class="creative-shapes"></div></div>',
      content: '<div class="visual-content"><div class="content-blocks"></div></div>',
      video: '<div class="visual-video"><div class="video-timeline"></div></div>',
      creators: '<div class="visual-creators"><div class="creator-network"></div></div>',
      'paid-media': '<div class="visual-paid"><div class="media-graph"></div></div>',
      community: '<div class="visual-community"><div class="community-web"></div></div>',
      data: '<div class="visual-data"><div class="data-points"></div></div>',
    };
    
    visual.innerHTML = visuals[toolId] || '';
    visual.style.setProperty('--tool-color', toolboxTools.find(t => t.id === toolId)?.color || '#FF3B30');
    
    visual.offsetHeight;
    visual.classList.add('visible');
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'toolbox-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        // Animate tools in
        const tools = Array.from(this.container.querySelectorAll('.toolbox-tool')) as HTMLElement[];
        tools.forEach((tool, i) => {
          tool.style.opacity = '0';
          tool.style.transform = 'translateY(30px)';
          setTimeout(() => {
            tool.style.transition = 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)';
            tool.style.opacity = '1';
            tool.style.transform = 'translateY(0)';
          }, i * 80);
        });
      },
    });
  }
  
  destroy(): void {}
}