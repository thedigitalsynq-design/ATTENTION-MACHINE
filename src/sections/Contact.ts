import { agencyConfig } from '../data/config';
import { createScrollTrigger } from '../utils/scrollTriggers';

type ContactSubmitHandler = (formData: FormData) => Promise<void>;

export class Contact {
  private container: HTMLElement;
  private submitHandler: ContactSubmitHandler;
  private prefersReducedMotion = false;
  private state: 'choice' | 'form' | 'loading' | 'success' | 'error' = 'choice';
  
  constructor(container: HTMLElement, submitHandler: ContactSubmitHandler) {
    this.container = container;
    this.submitHandler = submitHandler;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    this.bindEvents();
    this.setupScrollTrigger();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="contact-inner">
        <div class="terminal-header" aria-hidden="true">
          <span class="terminal-prompt">root@attention-machine:~$</span>
          <span class="terminal-cursor"></span>
        </div>
        <header class="contact-header">
          <h2 class="contact-title" id="connect-heading">
            <span class="title-word">SHOULD</span>
            <span class="title-word">WE MAKE</span>
            <span class="title-word title-accent">SOMETHING?</span>
          </h2>
        </header>
        
        <div class="contact-choice" role="radiogroup" aria-label="Contact intent">
          <button class="choice-btn" data-choice="yes" role="radio" aria-checked="false" data-cursor-hover="true">
            <span class="choice-label">YES</span>
            <svg class="choice-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button class="choice-btn" data-choice="absolutely" role="radio" aria-checked="false" data-cursor-hover="true">
            <span class="choice-label">ABSOLUTELY</span>
            <svg class="choice-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button class="choice-btn choice-btn-secondary" data-choice="looking" role="radio" aria-checked="false" data-cursor-hover="true">
            <span class="choice-label">I'M JUST LOOKING</span>
            <svg class="choice-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="contact-form-container" aria-hidden="true">
          <form class="contact-form" novalidate>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label" for="name">NAME</label>
                <input type="text" id="name" name="name" class="input-field" required autocomplete="name">
                <span class="input-error">Name is required</span>
              </div>
              <div class="input-group">
                <label class="input-label" for="company">COMPANY</label>
                <input type="text" id="company" name="company" class="input-field" autocomplete="organization">
              </div>
            </div>
            
            <div class="form-row">
              <div class="input-group">
                <label class="input-label" for="email">EMAIL</label>
                <input type="email" id="email" name="email" class="input-field" required autocomplete="email">
                <span class="input-error">Valid email is required</span>
              </div>
              <div class="input-group">
                <label class="input-label" for="social">SOCIAL / WEBSITE</label>
                <input type="url" id="social" name="social" class="input-field" placeholder="https://" autocomplete="url">
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label" for="project">WHAT ARE YOU BUILDING?</label>
              <textarea id="project" name="project" class="input-field" required rows="4" placeholder="Tell us about the project, the challenge, the ambition..."></textarea>
              <span class="input-error">Project description is required</span>
            </div>
            
            <div class="form-row">
              <div class="input-group">
                <label class="input-label" for="budget">BUDGET</label>
                <select id="budget" name="budget" class="input-field" required>
                  <option value="">SELECT</option>
                  <option value="25-50">$25K - $50K</option>
                  <option value="50-100">$50K - $100K</option>
                  <option value="100-250">$100K - $250K</option>
                  <option value="250-500">$250K - $500K</option>
                  <option value="500+">$500K+</option>
                </select>
                <span class="input-error">Budget range is required</span>
              </div>
            </div>
            
            <div class="input-group">
              <label class="input-label" for="message">MESSAGE</label>
              <textarea id="message" name="message" class="input-field" rows="4" placeholder="Anything else we should know?"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary form-submit" data-cursor-hover="true">
              <span>SEND IT</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
        
        <div class="contact-alt" aria-hidden="true">
          <p class="alt-text">Prefer a direct line?</p>
          <a href="mailto:${agencyConfig.contact.email}" class="alt-email" data-cursor-hover="true">
            ${agencyConfig.contact.email}
          </a>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .section-connect {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }
      
      .contact-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--container-max);
        margin: 0 auto;
        padding: var(--space-12) var(--container-padding);
      }
      
      /* Terminal/hacker aesthetic */
      .terminal-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px 4px 0 0;
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-accent);
        margin-bottom: 0;
      }
      
      .terminal-prompt {
        opacity: 0.8;
      }
      
      .terminal-cursor {
        display: inline-block;
        width: 8px;
        height: 14px;
        background: var(--color-accent);
        animation: cursorBlink 1s step-end infinite;
      }
      
      .contact-header {
        text-align: center;
        margin-bottom: var(--space-12);
        padding-top: var(--space-8);
        border: 1px solid var(--color-gray-300);
        border-top: none;
        border-radius: 0 0 4px 4px;
        background: linear-gradient(180deg, var(--color-gray-100) 0%, transparent 100%);
      }
      
      .contact-title {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-white);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      
      .contact-title .title-word {
        display: block;
      }
      
      .contact-title .title-accent {
        color: var(--color-accent);
      }
      
      .contact-choice {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
      }
      
      .choice-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        width: 100%;
        max-width: 400px;
        padding: var(--space-6) var(--space-8);
        font-family: var(--font-display);
        font-size: var(--text-xl);
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--color-white);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 4px;
        text-align: left;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .choice-btn:hover {
        border-color: var(--color-accent);
        background: var(--color-black);
        transform: translateX(8px);
      }
      
      .choice-btn:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 4px;
      }
      
      .choice-btn[aria-checked="true"] {
        border-color: var(--color-accent);
        background: var(--color-accent);
      }
      
      .choice-btn-secondary {
        font-size: var(--text-base);
        color: var(--color-gray-500);
        background: transparent;
        border-color: var(--color-gray-200);
      }
      
      .choice-btn-secondary:hover {
        color: var(--color-white);
        border-color: var(--color-gray-400);
        background: var(--color-gray-100);
        transform: none;
      }
      
      .choice-label {
        flex: 1;
      }
      
      .choice-arrow {
        flex-shrink: 0;
        transition: transform var(--duration-base) var(--ease-out);
      }
      
      .choice-btn:hover .choice-arrow {
        transform: translateX(8px);
      }
      
      .contact-form-container {
        display: none;
        flex: 1;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        animation: formSlideIn 0.6s var(--ease-out) forwards;
      }
      
      .contact-form-container.visible {
        display: block;
      }
      
      @keyframes formSlideIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }
      
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
      }
      
      .input-group {
        position: relative;
      }
      
      .input-label {
        display: block;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-gray-500);
        margin-bottom: var(--space-2);
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .input-field {
        width: 100%;
        padding: var(--space-3) var(--space-4);
        font-family: var(--font-ui);
        font-size: var(--text-base);
        color: var(--color-white);
        background: var(--color-gray-100);
        border: 1px solid var(--color-gray-300);
        border-radius: 2px;
        transition: all var(--duration-base) var(--ease-out);
      }
      
      .input-field::placeholder {
        color: var(--color-gray-500);
      }
      
      .input-field:hover {
        border-color: var(--color-gray-400);
      }
      
      .input-field:focus {
        outline: none;
        border-color: var(--color-accent);
        background: var(--color-black);
      }
      
      .input-field:focus + .input-label,
      .input-group:focus-within .input-label {
        color: var(--color-accent);
      }
      
      .input-field.error {
        border-color: var(--color-accent);
      }
      
      .input-error {
        font-size: var(--text-xs);
        color: var(--color-accent);
        margin-top: var(--space-1);
        display: none;
      }
      
      .input-field.error + .input-error {
        display: block;
      }
      
      textarea.input-field {
        min-height: 120px;
        resize: vertical;
      }
      
      select.input-field {
        cursor: pointer;
      }
      
      .form-submit {
        margin-top: var(--space-4);
        padding: var(--space-4) var(--space-8);
        font-size: var(--text-sm);
      }
      
      .form-submit:disabled {
        opacity: 0.6;
        pointer-events: none;
      }
      
      .contact-alt {
        text-align: center;
        padding-top: var(--space-12);
        border-top: 1px solid var(--color-gray-200);
      }
      
      .alt-text {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-gray-500);
        margin-bottom: var(--space-3);
      }
      
      .alt-email {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 500;
        color: var(--color-gray-400);
        transition: color var(--duration-base) var(--ease-out);
      }
      
      .alt-email:hover {
        color: var(--color-accent);
      }
      
      @media (max-width: 768px) {
        .contact-title {
          font-size: var(--text-3xl);
        }
        
        .choice-btn {
          font-size: var(--text-lg);
        }
        
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  private bindEvents(): void {
    // Choice buttons
    const choiceBtns = Array.from(this.container.querySelectorAll('.choice-btn')) as HTMLElement[];
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleChoice(btn.dataset.choice!));
      btn.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleChoice(btn.dataset.choice!);
        }
      });
    });
    
    // Form submission
    const form = this.container.querySelector('.contact-form') as HTMLFormElement;
    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Input validation
    form?.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input as HTMLInputElement));
      input.addEventListener('input', () => this.clearError(input as HTMLInputElement));
    });
  }
  
  private handleChoice(choice: string): void {
    // Update button states
    const choiceBtns = Array.from(this.container.querySelectorAll('.choice-btn')) as HTMLElement[];
    choiceBtns.forEach(btn => {
      const isSelected = btn.dataset.choice === choice;
      btn.setAttribute('aria-checked', isSelected.toString());
    });
    
    if (choice === 'looking') {
      // Just scroll to alt contact
      this.container.querySelector('.contact-alt')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Show form
    this.state = 'form';
    const choiceContainer = this.container.querySelector('.contact-choice') as HTMLElement;
    const formContainer = this.container.querySelector('.contact-form-container') as HTMLElement;
    
    if (this.prefersReducedMotion) {
      choiceContainer.style.display = 'none';
      formContainer.classList.add('visible');
      return;
    }
    
    choiceContainer.style.opacity = '0';
    choiceContainer.style.transform = 'translateY(-20px)';
    choiceContainer.style.transition = 'opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)';
    
    setTimeout(() => {
      choiceContainer.style.display = 'none';
      formContainer.classList.add('visible');
      
      // Focus first field
      const firstInput = formContainer.querySelector('.input-field') as HTMLInputElement;
      firstInput?.focus();
    }, 300);
  }
  
  private validateField(input: HTMLInputElement): boolean {
    const isValid = input.checkValidity();
    input.classList.toggle('error', !isValid);
    return isValid;
  }
  
  private clearError(input: HTMLInputElement): void {
    input.classList.remove('error');
  }
  
  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const submitBtn = form.querySelector('.form-submit') as HTMLButtonElement;
    
    // Validate all fields
    let isValid = true;
    form.querySelectorAll('.input-field[required]').forEach(input => {
      if (!this.validateField(input as HTMLInputElement)) {
        isValid = false;
      }
    });
    
    if (!isValid) return;
    
    // Show loading
    this.state = 'loading';
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>TRANSMITTING...</span>
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
    `;
    
    // Collect form data
    const formData = new FormData(form);
    
    try {
      await this.submitHandler(formData);
      this.state = 'success';
      this.showFormSuccess();
    } catch (error) {
      this.state = 'error';
      this.showFormError();
    }
  }
  
  private showFormSuccess(): void {
    const formContainer = this.container.querySelector('.contact-form-container') as HTMLElement;
    formContainer.innerHTML = `
      <div class="form-success">
        <div class="success-icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="16 12 22 12"></polyline>
            <polyline points="22 12 18 8"></polyline>
            <polyline points="22 12 18 16"></polyline>
          </svg>
        </div>
        <h3 class="success-title">LET'S BUILD IT.</h3>
        <p class="success-message">Your signal has been received. We'll be in touch within 24 hours.</p>
      </div>
    `;
    
    // Add success styles
    const style = document.createElement('style');
    style.textContent = `
      .form-success {
        text-align: center;
        padding: var(--space-12);
      }
      
      .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--space-8);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-accent);
        border-radius: 50%;
        color: var(--color-accent);
        animation: successPulse 2s var(--ease-in-out) infinite;
      }
      
      @keyframes successPulse {
        0%, 100% { box-shadow: 0 0 0 0 var(--color-accent-dim); }
        50% { box-shadow: 0 0 40px var(--color-accent-dim); }
      }
      
      .success-title {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--color-white);
        margin-bottom: var(--space-4);
      }
      
      .success-message {
        font-size: var(--text-lg);
        color: var(--color-gray-400);
      }
    `;
    document.head.appendChild(style);
  }
  
  private showFormError(): void {
    const formContainer = this.container.querySelector('.contact-form-container') as HTMLElement;
    const submitBtn = formContainer.querySelector('.form-submit') as HTMLButtonElement;
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <span>SEND IT</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
    
    // Shake animation
    formContainer.style.animation = 'formShake 0.5s var(--ease-out)';
    setTimeout(() => formContainer.style.animation = '', 500);
    
    // Add shake styles
    if (!document.querySelector('#form-shake')) {
      const style = document.createElement('style');
      style.id = 'form-shake';
      style.textContent = `
        @keyframes formShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  private setupScrollTrigger(): void {
    createScrollTrigger({
      id: 'contact-enter',
      element: this.container.closest('.section')!,
      start: 'top center',
      onEnter: () => {
        // Animate choice buttons
        const btns = Array.from(this.container.querySelectorAll('.choice-btn')) as HTMLElement[];
        btns.forEach((btn, i) => {
          btn.style.opacity = '0';
          btn.style.transform = 'translateY(30px)';
          setTimeout(() => {
            btn.style.transition = 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
          }, i * 100);
        });
      },
    });
  }
  
  destroy(): void {}
}