import { projects } from '../data/config';
import { stopScroll, startScroll } from '../utils/lenis';
import { play } from '../utils/sound';

type Project = (typeof projects)[number];

const STAGE_VISUAL_WORDS = ['CONTEXT', 'FRICTION', 'SPARK', 'SIGNAL'];

export class CaseStudyViewer {
  private container: HTMLElement;
  private current: Project | null = null;
  private lastFocused: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="cs-backdrop" data-cs-close>
        <div class="cs-panel" role="dialog" aria-modal="true" aria-labelledby="cs-title">
          <div class="cs-scroll">
            <div class="cs-content"></div>
          </div>
        </div>
      </div>
    `;
    this.addStyles();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.container.querySelector('[data-cs-close]')?.addEventListener('click', (e) => {
      // Only close when clicking the backdrop itself, not the panel
      if ((e.target as HTMLElement).hasAttribute('data-cs-close')) this.close();
    });
    document.addEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.isOpen()) this.close();
  };

  isOpen(): boolean {
    return this.container.classList.contains('visible');
  }

  open(project: Project): void {
    this.current = project;
    this.lastFocused = document.activeElement as HTMLElement | null;

    const content = this.container.querySelector('.cs-content') as HTMLElement | null;
    if (content) content.innerHTML = this.template(project);

    const scroll = this.container.querySelector('.cs-scroll') as HTMLElement | null;
    if (scroll) scroll.scrollTop = 0;

    this.container.classList.add('visible');
    this.container.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    stopScroll();
    play('transition');

    // Wire panel buttons
    content?.querySelector('[data-cs-action="close"]')?.addEventListener('click', () => this.close());
    content?.querySelector('[data-cs-action="prev"]')?.addEventListener('click', () => this.step(-1));
    content?.querySelector('[data-cs-action="next"]')?.addEventListener('click', () => this.step(1));

    // Focus the close button for keyboard users
    const closeBtn = content?.querySelector('[data-cs-action="close"]') as HTMLElement | null;
    closeBtn?.focus();

    // Animate stages in
    const stages = Array.from(content?.querySelectorAll('.cs-stage') ?? []) as HTMLElement[];
    stages.forEach((stage, i) => {
      stage.style.opacity = '0';
      stage.style.transform = 'translateY(28px)';
      setTimeout(() => {
        stage.style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)';
        stage.style.opacity = '1';
        stage.style.transform = 'translateY(0)';
      }, 120 + i * 110);
    });
  }

  close(): void {
    if (!this.isOpen()) return;
    this.container.classList.remove('visible');
    this.container.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    startScroll();
    this.current = null;
    if (this.lastFocused?.focus) this.lastFocused.focus();
  }

  private step(direction: number): void {
    if (!this.current) return;
    const idx = projects.findIndex((p) => p.id === this.current!.id);
    const next = projects[(idx + direction + projects.length) % projects.length];
    if (next) this.open(next as Project);
  }

  private template(project: Project): string {
    const idx = projects.findIndex((p) => p.id === project.id);
    const stages = [
      { n: '01', kicker: 'THE BRIEF', title: 'Where it started.', body: project.brief },
      { n: '02', kicker: 'THE PROBLEM', title: 'What was in the way.', body: project.problem },
      { n: '03', kicker: 'THE IDEA', title: 'The move we made.', body: project.idea },
      { n: '04', kicker: 'THE INTERNET REACTED', title: 'Culture picked it up.', body: project.reaction },
    ];
    return `
      <div class="cs-topbar">
        <span class="cs-count">${String(idx + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</span>
        <span class="cs-meta">${project.client} &nbsp;•&nbsp; ${project.category} &nbsp;•&nbsp; ${project.year}</span>
        <button class="cs-close" data-cs-action="close" aria-label="Close case study" data-cursor-hover="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <header class="cs-hero">
        <p class="cs-kicker">CASE STUDY</p>
        <h2 class="cs-title" id="cs-title">${project.title}</h2>
        <div class="cs-tags">${project.tags.map((t) => `<span class="cs-tag">${t}</span>`).join('')}</div>
      </header>

      ${stages
        .map(
          (s, i) => `
        <section class="cs-stage" aria-label="${s.kicker}">
          <div class="cs-stage-head"><span class="cs-stage-num">${s.n}</span><p class="cs-stage-kicker">${s.kicker}</p></div>
          <h3 class="cs-stage-title">${s.title}</h3>
          <p class="cs-stage-body">${s.body}</p>
        </section>
        ${i < stages.length - 1 ? this.visual(i) : ''}
      `
        )
        .join('')}

      <section class="cs-stage cs-result" aria-label="THE RESULT">
        <div class="cs-stage-head"><span class="cs-stage-num">05</span><p class="cs-stage-kicker">THE RESULT</p></div>
        <h3 class="cs-stage-title">Did it work?</h3>
        <div class="cs-results">
          ${project.results
            .map(
              (r) => `
            <div class="cs-result-card">
              <span class="cs-result-value">${r.value}</span>
              <span class="cs-result-metric">${r.metric}</span>
            </div>
          `
            )
            .join('')}
        </div>
        <p class="cs-disclaimer">Configurable placeholder metrics. No fabricated client results.</p>
      </section>

      <footer class="cs-footer">
        <button class="btn btn-secondary" data-cs-action="prev" data-cursor-hover="true">← PREV PROJECT</button>
        <button class="btn btn-secondary" data-cs-action="next" data-cursor-hover="true">NEXT PROJECT →</button>
      </footer>
    `;
  }

  private visual(i: number): string {
    const word = STAGE_VISUAL_WORDS[i % STAGE_VISUAL_WORDS.length];
    return `
      <div class="cs-visual cs-visual-${(i % 4) + 1}" aria-hidden="true">
        <span class="cs-visual-word">${word}</span>
        <span class="cs-visual-num">0${i + 1}</span>
      </div>
    `;
  }

  private addStyles(): void {
    if (document.querySelector('#cs-styles')) return;
    const style = document.createElement('style');
    style.id = 'cs-styles';
    style.textContent = `
      .case-study { position: fixed; inset: 0; z-index: 300; pointer-events: none; opacity: 0; transition: opacity 400ms cubic-bezier(0.16,1,0.3,1); }
      .case-study.visible { opacity: 1; pointer-events: auto; }
      .cs-backdrop { position: absolute; inset: 0; background: rgba(5,5,5,0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; justify-content: center; padding: clamp(1rem, 3vw, 3rem); }
      .cs-panel { width: min(880px, 100%); max-height: 100%; background: var(--color-black); border: 1px solid var(--color-gray-300); border-radius: 6px; overflow: hidden; transform: translateY(24px) scale(0.98); transition: transform 500ms cubic-bezier(0.16,1,0.3,1); display: flex; }
      .case-study.visible .cs-panel { transform: translateY(0) scale(1); }
      .cs-scroll { overflow-y: auto; width: 100%; max-height: calc(100vh - clamp(2rem, 6vw, 6rem)); }
      .cs-content { padding: clamp(1.5rem, 4vw, 3.5rem); }
      .cs-topbar { display: flex; align-items: center; gap: 1rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-gray-500); padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-gray-200); }
      .cs-count { color: var(--color-accent); font-weight: 600; }
      .cs-meta { flex: 1; letter-spacing: 0.05em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cs-close { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--color-gray-300); color: var(--color-white); transition: all 200ms ease; flex-shrink: 0; }
      .cs-close:hover { border-color: var(--color-accent); color: var(--color-accent); transform: rotate(90deg); }
      .cs-hero { text-align: left; padding: 2.5rem 0 1rem; }
      .cs-kicker { font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; color: var(--color-accent); margin-bottom: 1rem; }
      .cs-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.75rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; color: var(--color-white); margin-bottom: 1.25rem; }
      .cs-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .cs-tag { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-gray-400); border: 1px solid var(--color-gray-300); border-radius: 100px; padding: 0.3rem 0.8rem; }
      .cs-stage { padding: 2.5rem 0; border-top: 1px solid var(--color-gray-200); }
      .cs-stage-head { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 0.75rem; }
      .cs-stage-num { font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-accent); }
      .cs-stage-kicker { font-family: var(--font-display); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; color: var(--color-gray-500); }
      .cs-stage-title { font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 600; color: var(--color-white); margin-bottom: 1rem; letter-spacing: -0.01em; }
      .cs-stage-body { font-size: 1.05rem; line-height: 1.7; color: var(--color-gray-400); max-width: 62ch; }
      .cs-visual { position: relative; margin: 0.5rem 0; border-radius: 4px; min-height: 190px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--color-gray-300); }
      .cs-visual-1 { background: radial-gradient(ellipse 70% 90% at 20% 100%, rgba(255,59,48,0.22), transparent 65%), var(--color-gray-100); }
      .cs-visual-2 { background: radial-gradient(ellipse 70% 90% at 85% 0%, rgba(175,82,222,0.20), transparent 65%), var(--color-gray-100); }
      .cs-visual-3 { background: radial-gradient(ellipse 70% 90% at 50% 110%, rgba(255,159,10,0.18), transparent 65%), var(--color-gray-100); }
      .cs-visual-4 { background: radial-gradient(ellipse 70% 90% at 50% -10%, rgba(0,122,255,0.20), transparent 65%), var(--color-gray-100); }
      .cs-visual-word { font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 700; letter-spacing: 0.04em; color: transparent; -webkit-text-stroke: 1px var(--color-gray-400); opacity: 0.8; user-select: none; }
      .cs-visual-num { position: absolute; bottom: 0.75rem; right: 1rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-gray-500); }
      .cs-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin: 1.5rem 0 1rem; }
      .cs-result-card { background: var(--color-gray-100); border: 1px solid var(--color-gray-300); border-radius: 4px; padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 0.4rem; transition: border-color 200ms ease; }
      .cs-result-card:hover { border-color: var(--color-accent); }
      .cs-result-value { font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; color: var(--color-accent); }
      .cs-result-metric { font-family: var(--font-display); font-size: 0.7rem; letter-spacing: 0.08em; color: var(--color-gray-500); }
      .cs-disclaimer { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-gray-500); }
      .cs-footer { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; padding-top: 2rem; border-top: 1px solid var(--color-gray-200); }
      @media (max-width: 640px) { .cs-meta { display: none; } .cs-footer .btn { flex: 1; justify-content: center; } }
      @media (prefers-reduced-motion: reduce) { .case-study, .cs-panel { transition: none; } }
    `;
    document.head.appendChild(style);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
