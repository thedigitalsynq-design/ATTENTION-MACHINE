import { projects } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';
import { random } from '../utils/helpers';

export class CampaignUniverse {
  private container: HTMLElement;
  private planets: HTMLElement[] = [];
  private animationFrame: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private prefersReducedMotion = false;
  private selectedPlanet: HTMLElement | null = null;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.initPlanets();
    this.bindEvents();
    this.startAnimation();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="universe-inner">
        <header class="universe-header">
          <h2 class="universe-title" id="amplify-heading">
            <span class="title-word">CAMPAIGN</span>
            <span class="title-word">UNIVERSE</span>
          </h2>
          <p class="universe-subtitle">Explore our work. Drag to navigate. Click to enter a case study.</p>
        </header>
        
        <div class="universe-canvas" role="application" aria-label="Campaign universe" tabindex="0">
          <div class="universe-bg" aria-hidden="true"></div>
          <div class="universe-planets"></div>
          <div class="universe-connections" aria-hidden="true"></div>
        </div>
        
        <div class="universe-legend" aria-hidden="true">
          <div class="legend-item">
            <span class="legend-dot" style="background: var(--color-accent);"></span>
            <span>MAJOR CAMPAIGNS</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: var(--color-gray-400);"></span>
            <span>EXPERIMENTAL WORK</span>
          </div>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-amplify {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        background: var(--color-black);
      }
      
      .universe-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
        position: relative;
      }
      
      .universe-header {
        text-align: center;
        margin-bottom: var(--space-8);
        z-index: 10;
      }
      
      .universe-title {
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
      
      .universe-title .title-word {
        display: block;
      }
      
      .universe-subtitle {
        font-size: var(--text-lg);
        color: var(--color-gray-500);
      }
      
      .universe-canvas {
        flex: 1;
        position: relative;
        border-radius: 4px;
        background: var(--color-black);
        border: 1px solid var(--color-gray-300);
        overflow: hidden;
        cursor: grab;
      }
      
      .universe-canvas.dragging {
        cursor: grabbing;
      }
      
      .universe-bg {
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(1px 1px at 20% 30%, var(--color-gray-400) 50%, transparent),
          radial-gradient(1px 1px at 80% 70%, var(--color-gray-400) 50%, transparent),
          radial-gradient(2px 2px at 40% 80%, var(--color-accent) 50%, transparent),
          radial-gradient(1px 1px at 60% 20%, var(--color-gray-400) 50%, transparent),
          radial-gradient(1px 1px at 10% 90%, rgba(255,59,48,0.4) 50%, transparent),
          radial-gradient(1px 1px at 90% 10%, rgba(255,59,48,0.3) 50%, transparent),
          radial-gradient(2px 2px at 30% 60%, rgba(255,59,48,0.2) 50%, transparent),
          radial-gradient(1px 1px at 70% 40%, var(--color-gray-400) 50%, transparent);
        background-size: 200px 200px, 200px 200px, 200px 200px, 200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px;
        animation: starfield 60s linear infinite;
        opacity: 0.3;
      }
      
      .universe-bg::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 40% 30% at 25% 35%, rgba(255,59,48,0.06) 0%, transparent 100%),
          radial-gradient(ellipse 35% 25% at 75% 65%, rgba(88,86,214,0.04) 0%, transparent 100%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,59,48,0.03) 0%, transparent 100%);
        animation: nebulaDrift 20s ease-in-out infinite;
      }
      
      .universe-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle 2px at 15% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(circle 1px at 85% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(circle 2px at 45% 75%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(circle 1px at 65% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(circle 1px at 25% 55%, rgba(255,255,255,0.4) 0%, transparent 100%);
        animation: orbPulse 4s ease-in-out infinite, orbPulse 5s ease-in-out infinite 1s;
      }
      
      @keyframes starfield {
        0% { transform: translate(0, 0) rotate(0deg); }
        100% { transform: translate(-200px, -200px) rotate(360deg); }
      }
      
      .universe-planets {
        position: absolute;
        inset: 0;
      }
      
      .universe-planet {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: transform var(--duration-base) var(--ease-out);
        will-change: transform;
      }
      
      .universe-planet.major .planet-core {
        width: 120px;
        height: 120px;
        border-color: var(--color-accent);
        box-shadow: 0 0 60px var(--color-accent-dim);
      }
      
      .universe-planet.major .planet-ring {
        width: 180px;
        height: 180px;
        border-color: var(--color-accent);
        opacity: 0.3;
      }
      
      .universe-planet.minor .planet-core {
        width: 60px;
        height: 60px;
        border-color: var(--color-gray-400);
      }
      
      .universe-planet.minor .planet-ring {
        width: 100px;
        height: 100px;
        border-color: var(--color-gray-400);
        opacity: 0.2;
      }
      
      .planet-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid;
        border-radius: 50%;
        animation: ringRotate 20s linear infinite;
      }
      
      .planet-ring:nth-child(2) {
        animation-direction: reverse;
        animation-duration: 30s;
      }
      
      @keyframes ringRotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      .planet-core {
        position: relative;
        z-index: 2;
        border-radius: 50%;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 70%), var(--color-black);
        overflow: hidden;
      }
      
      .planet-core::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        border: 1px solid currentColor;
        opacity: 0;
        animation: corePulse 3s var(--ease-in-out) infinite;
      }
      
      @keyframes corePulse {
        0%, 100% { transform: scale(1); opacity: 0; }
        50% { transform: scale(1.3); opacity: 0.5; }
      }
      
      .planet-label {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        white-space: nowrap;
        opacity: 0;
        transition: opacity var(--duration-base) var(--ease-out);
        pointer-events: none;
      }
      
      .universe-planet:hover .planet-label,
      .universe-planet.focused .planet-label {
        opacity: 1;
      }
      
      .universe-planet.hovered .planet-core {
        transform: scale(1.1);
      }
      
      .universe-planet.hovered .planet-core::before {
        animation: none;
        opacity: 1;
        transform: scale(1.5);
      }
      
      .universe-connections {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      
      .connection-line {
        position: absolute;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--color-gray-300), transparent);
        transform-origin: left center;
        opacity: 0.3;
      }
      
      .universe-legend {
        display: flex;
        justify-content: center;
        gap: var(--space-8);
        margin-top: var(--space-8);
        padding-top: var(--space-8);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
      }
      
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      
      @media (max-width: 768px) {
        .universe-title {
          font-size: var(--text-2xl);
        }
        
        .universe-planet.major .planet-core {
          width: 80px;
          height: 80px;
        }
        
        .universe-planet.major .planet-ring {
          width: 130px;
          height: 130px;
        }
        
        .universe-planet.minor .planet-core {
          width: 45px;
          height: 45px;
        }
        
        .universe-planet.minor .planet-ring {
          width: 75px;
          height: 75px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private initPlanets(): void {
    const planetsContainer = this.container.querySelector('.universe-planets') as HTMLElement;
    this.container.querySelector('.universe-connections') as HTMLElement;
    
    // Major projects (larger planets)
    const majorProjects = projects.slice(0, 3);
    const minorProjects = projects.slice(3);
    
    [...majorProjects, ...minorProjects].forEach((project, index) => {
      const isMajor = index < 3;
      const planet = this.createPlanet(project, isMajor, index);
      planetsContainer.appendChild(planet);
      this.planets.push(planet);
    });
    
    // Create connections between planets
    this.createConnections();
    
    // Initial positions
    this.positionPlanets();
  }
  
  private createPlanet(project: any, isMajor: boolean, index: number): HTMLElement {
    const planet = document.createElement('div');
    planet.className = `universe-planet ${isMajor ? 'major' : 'minor'}`;
    planet.dataset.projectId = project.id;
    planet.dataset.index = index.toString();
    planet.setAttribute('role', 'button');
    planet.setAttribute('aria-label', `${project.title} - ${project.client}`);
    planet.setAttribute('tabindex', '0');
    
    planet.innerHTML = `
      ${isMajor ? '<div class="planet-ring"></div><div class="planet-ring"></div>' : '<div class="planet-ring"></div>'}
      <div class="planet-core"></div>
      <span class="planet-label">${project.title}</span>
    `;
    
    // Click to enter case study
    planet.addEventListener('click', () => this.enterCaseStudy(project));
    planet.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.enterCaseStudy(project);
      }
    });
    
    // Hover effects
    planet.addEventListener('mouseenter', () => planet.classList.add('hovered'));
    planet.addEventListener('mouseleave', () => planet.classList.remove('hovered'));
    planet.addEventListener('focus', () => planet.classList.add('focused'));
    planet.addEventListener('blur', () => planet.classList.remove('focused'));
    
    return planet;
  }
  
  private positionPlanets(): void {
    const canvas = this.container.querySelector('.universe-canvas') as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    this.planets.forEach((planet, index) => {
      const isMajor = index < 3;
      const angle = (index / this.planets.length) * Math.PI * 2;
      const radius = isMajor 
        ? Math.min(rect.width, rect.height) * 0.25
        : Math.min(rect.width, rect.height) * 0.35;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      planet.style.left = `${x}px`;
      planet.style.top = `${y}px`;
      planet.style.transform = 'translate(-50%, -50%)';
      
      // Store base position
      planet.dataset.baseX = x.toString();
      planet.dataset.baseY = y.toString();
    });
  }
  
  private createConnections(): void {
    const connectionsContainer = this.container.querySelector('.universe-connections') as HTMLElement;
    
    // Connect major planets to each other
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const line = document.createElement('div');
        line.className = 'connection-line';
        line.dataset.from = i.toString();
        line.dataset.to = j.toString();
        connectionsContainer.appendChild(line);
      }
    }
    
    // Connect minor planets to nearest major
    for (let i = 3; i < this.planets.length; i++) {
      const line = document.createElement('div');
      line.className = 'connection-line';
      line.dataset.from = i.toString();
      line.dataset.to = (i % 3).toString();
      connectionsContainer.appendChild(line);
    }
  }
  
  private updateConnections(): void {
    const connections = this.container.querySelectorAll('.connection-line');
    
    connections.forEach(line => {
      const htmlLine = line as HTMLElement;
      const fromIndex = parseInt(htmlLine.dataset.from!);
      const toIndex = parseInt(htmlLine.dataset.to!);
      
      const fromPlanet = this.planets[fromIndex];
      const toPlanet = this.planets[toIndex];
      
      if (!fromPlanet || !toPlanet) return;
      
      const fromX = parseFloat(fromPlanet.dataset.baseX!) + (parseFloat(fromPlanet.style.left) - parseFloat(fromPlanet.dataset.baseX!));
      const fromY = parseFloat(fromPlanet.dataset.baseY!) + (parseFloat(fromPlanet.style.top) - parseFloat(fromPlanet.dataset.baseY!));
      const toX = parseFloat(toPlanet.dataset.baseX!) + (parseFloat(toPlanet.style.left) - parseFloat(toPlanet.dataset.baseX!));
      const toY = parseFloat(toPlanet.dataset.baseY!) + (parseFloat(toPlanet.style.top) - parseFloat(toPlanet.dataset.baseY!));
      
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      htmlLine.style.width = `${distance}px`;
      htmlLine.style.left = `${fromX}px`;
      htmlLine.style.top = `${fromY}px`;
      htmlLine.style.transform = `rotate(${angle}rad)`;
    });
  }
  
  private bindEvents(): void {
    const canvas = this.container.querySelector('.universe-canvas') as HTMLElement;
    
    // Drag to navigate
    canvas.addEventListener('mousedown', this.onDragStart.bind(this));
    canvas.addEventListener('touchstart', this.onDragStart.bind(this), { passive: true });
    
    window.addEventListener('mousemove', this.onDragMove.bind(this), { passive: true });
    window.addEventListener('touchmove', this.onDragMove.bind(this), { passive: true });
    
    window.addEventListener('mouseup', this.onDragEnd.bind(this));
    window.addEventListener('touchend', this.onDragEnd.bind(this));
    
    // Mouse move for parallax
    canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX - canvas.getBoundingClientRect().left;
      this.mouseY = e.clientY - canvas.getBoundingClientRect().top;
    });
  }
  
  private onDragStart(e: MouseEvent | TouchEvent): void {
    if (this.prefersReducedMotion) return;
    if ((e.target as HTMLElement).closest('.universe-planet')) return;
    
    this.container.querySelector('.universe-canvas')?.classList.add('dragging');
    this.isDragging = true;
    this.startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  }
  
  private onDragMove(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = currentX - this.startX;
    const deltaY = currentY - this.startY;
    
    // Move all planets
    this.planets.forEach(planet => {
      const baseX = parseFloat(planet.dataset.baseX!);
      const baseY = parseFloat(planet.dataset.baseY!);
      planet.style.left = `${baseX + deltaX * 0.5}px`;
      planet.style.top = `${baseY + deltaY * 0.5}px`;
    });
    
    this.updateConnections();
  }
  
  private onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    this.container.querySelector('.universe-canvas')?.classList.remove('dragging');
    
    // Update base positions
    this.planets.forEach(planet => {
      const left = parseFloat(planet.style.left);
      const top = parseFloat(planet.style.top);
      planet.dataset.baseX = left.toString();
      planet.dataset.baseY = top.toString();
    });
  }
  
  private startAnimation(): void {
    if (this.prefersReducedMotion || this.animationFrame) return;
    
    const animate = () => {
      // Subtle orbital motion
      this.planets.forEach((planet, index) => {
        if (this.isDragging) return;
        
        const isMajor = index < 3;
        const baseX = parseFloat(planet.dataset.baseX!);
        const baseY = parseFloat(planet.dataset.baseY!);
        const time = Date.now() * 0.0001;
        const orbitRadius = isMajor ? 15 : 25;
        const speed = isMajor ? 0.5 : 0.3;
        
        const x = baseX + Math.cos(time * speed + index) * orbitRadius;
        const y = baseY + Math.sin(time * speed + index) * orbitRadius;
        
        planet.style.left = `${x}px`;
        planet.style.top = `${y}px`;
      });
      
      this.updateConnections();
      
      // Mouse parallax
      if (this.mouseX || this.mouseY) {
        const canvas = this.container.querySelector('.universe-canvas') as HTMLElement;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const offsetX = (this.mouseX - centerX) * 0.02;
        const offsetY = (this.mouseY - centerY) * 0.02;
        
        this.planets.forEach((planet, index) => {
          const factor = (index < 3 ? 1 : 1.5) * 0.5;
          const left = parseFloat(planet.style.left);
          const top = parseFloat(planet.style.top);
          planet.style.left = `${left + offsetX * factor}px`;
          planet.style.top = `${top + offsetY * factor}px`;
        });
      }
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private enterCaseStudy(project: any): void {
    // In a real implementation, this would navigate to a case study page
    // For now, show an alert or modal
    console.log('Enter case study:', project.title);
    
    // Could dispatch event to navigate
    window.dispatchEvent(new CustomEvent('enterCaseStudy', { detail: project }));
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'universe-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        // Animate planets in
        this.planets.forEach((planet, i) => {
          planet.style.opacity = '0';
          planet.style.transform = 'translate(-50%, -50%) scale(0.5)';
          setTimeout(() => {
            planet.style.transition = 'opacity var(--duration-slower) var(--ease-spring), transform var(--duration-slower) var(--ease-spring)';
            planet.style.opacity = '1';
            planet.style.transform = 'translate(-50%, -50%) scale(1)';
          }, i * 100);
        });
      },
    });
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