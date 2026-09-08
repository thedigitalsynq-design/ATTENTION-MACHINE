import { navItems } from './data/config';
import { Navigation } from './components/Navigation';
import { OpeningExperience } from './sections/OpeningExperience';
import { Hero } from './sections/Hero';
import { AttentionMeter } from './sections/AttentionMeter';
import { Interrupt } from './sections/Interrupt';
import { SocialFeed } from './sections/SocialFeed';
import { Toolbox } from './sections/Toolbox';
import { IdeaGenerator } from './sections/IdeaGenerator';
import { CampaignUniverse } from './sections/CampaignUniverse';
import { CaseStudyViewer } from './sections/CaseStudy';
import { LiveCultureWall } from './sections/LiveCultureWall';
import { TheAlgorithm } from './sections/TheAlgorithm';
import { Performance } from './sections/Performance';
import { HumanSection } from './sections/HumanSection';
import { Manifesto } from './sections/Manifesto';
import { About } from './sections/About';
import { People } from './sections/People';
import { Contact } from './sections/Contact';
import { FinalScreen } from './components/FinalScreen';
import { AttentionSignal } from './components/AttentionSignal';
import { LiveStatus } from './components/LiveStatus';
import { createScrollTrigger } from './utils/scrollTriggers';
import { initSound } from './utils/sound';

export class App {
  private container: HTMLElement | null = null;
  private sections: HTMLElement[] = [];
  private navigation: Navigation | null = null;
  private attentionSignal: AttentionSignal | null = null;
  private liveStatus: LiveStatus | null = null;
  private finalScreen: FinalScreen | null = null;
  private caseStudy: CaseStudyViewer | null = null;
  private onEnterCaseStudy = (e: Event): void => {
    const project = (e as CustomEvent).detail;
    if (project) this.caseStudy?.open(project);
  };
  mount(rootSelector: string): void {
    const root = document.querySelector(rootSelector);
    if (!root) {
      console.error('[App] Root element not found');
      return;
    }
    
    this.container = root as HTMLElement;
    this.render();
    this.initializeComponents();
    this.setupScrollTriggers();
    
    
    // Initialize sound after user interaction
    document.addEventListener('click', () => {
      initSound();
    }, { once: true });
  }
  
  private render(): void {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <!-- Opening Experience Overlay -->
      <div id="opening-experience" class="opening-experience" role="dialog" aria-modal="true" aria-label="Opening experience"></div>
      
      <!-- Navigation -->
      <nav id="navigation" class="navigation" role="navigation" aria-label="Main navigation"></nav>
      
      <!-- Main Content -->
      <main id="main-content" class="main-content" role="main">
        <!-- ENTER - Hero -->
        <section id="enter" class="section section-enter" data-section="enter" aria-labelledby="enter-heading">
          <div id="hero" class="hero"></div>
        </section>
        
        <!-- Attention Meter -->
        <section id="attention-meter" class="section section-attention-meter" data-section="attention-meter" aria-labelledby="attention-heading">
          <div id="attention-meter-content" class="attention-meter"></div>
        </section>
        
        <!-- INTERRUPT -->
        <section id="interrupt" class="section section-interrupt" data-section="interrupt" aria-labelledby="interrupt-heading">
          <div id="interrupt-content" class="interrupt"></div>
        </section>
        
        <!-- DISCOVER - Social Feed -->
        <section id="discover" class="section section-discover" data-section="discover" aria-labelledby="discover-heading">
          <div id="social-feed" class="social-feed"></div>
        </section>
        
        <!-- CREATE - Toolbox -->
        <section id="create" class="section section-create" data-section="create" aria-labelledby="create-heading">
          <div id="toolbox" class="toolbox"></div>
        </section>
        
        <!-- Idea Generator -->
        <section id="idea-generator" class="section section-idea-generator" data-section="idea-generator" aria-labelledby="idea-heading">
          <div id="idea-generator-content" class="idea-generator"></div>
        </section>
        
        <!-- AMPLIFY - Campaign Universe -->
        <section id="amplify" class="section section-amplify" data-section="amplify" aria-labelledby="amplify-heading">
          <div id="campaign-universe" class="campaign-universe"></div>
        </section>
        
        <!-- MEASURE - Live Culture Wall -->
        <section id="measure" class="section section-measure" data-section="measure" aria-labelledby="measure-heading">
          <div id="live-culture-wall" class="live-culture-wall"></div>
        </section>
        
        <!-- The Algorithm -->
        <section id="algorithm" class="section section-algorithm" data-section="algorithm" aria-labelledby="algorithm-heading">
          <div id="the-algorithm" class="the-algorithm"></div>
        </section>
        
        <!-- Performance -->
        <section id="results" class="section section-results" data-section="results" aria-labelledby="results-heading">
          <div id="performance" class="performance"></div>
        </section>
        
        <!-- REMEMBER - Human Section -->
        <section id="remember" class="section section-remember" data-section="remember" aria-labelledby="remember-heading">
          <div id="human-section" class="human-section"></div>
        </section>
        
        <!-- Manifesto -->
        <section id="manifesto" class="section section-manifesto" data-section="manifesto" aria-labelledby="manifesto-heading">
          <div id="manifesto-content" class="manifesto"></div>
        </section>
        
        <!-- About -->
        <section id="think" class="section section-think" data-section="think" aria-labelledby="think-heading">
          <div id="about" class="about"></div>
        </section>
        
        <!-- People -->
        <section id="people" class="section section-people" data-section="people" aria-labelledby="people-heading">
          <div id="people-content" class="people"></div>
        </section>
        
        <!-- CONNECT - Contact -->
        <section id="connect" class="section section-connect" data-section="connect" aria-labelledby="connect-heading">
          <div id="contact" class="contact"></div>
        </section>
      </main>
      
      <!-- UI Components -->
      <div id="attention-signal" class="attention-signal" aria-live="polite" aria-atomic="true"></div>
      <div id="live-status" class="live-status" aria-live="polite"></div>
      
      <!-- Case Study Viewer Overlay -->
      <div id="case-study" class="case-study" aria-hidden="true"></div>

      <!-- Final Screen Overlay -->
      <div id="final-screen" class="final-screen" role="dialog" aria-modal="true" aria-label="Submission confirmation"></div>
    `;
    
    // Cache section elements
    this.sections = Array.from(this.container.querySelectorAll('.section'));
  }
  
  private initializeComponents(): void {
    // Navigation
    const navContainer = this.container?.querySelector('#navigation');
    if (navContainer) {
      this.navigation = new Navigation(navContainer as HTMLElement, navItems);
    }
    
    // Opening Experience
    const openingContainer = this.container?.querySelector('#opening-experience');
    if (openingContainer) {
      new OpeningExperience(openingContainer as HTMLElement);
    }
    
    // Hero
    const heroContainer = this.container?.querySelector('#hero');
    if (heroContainer) {
      new Hero(heroContainer as HTMLElement);
    }
    
    // Attention Meter
    const attentionContainer = this.container?.querySelector('#attention-meter-content');
    if (attentionContainer) {
      new AttentionMeter(attentionContainer as HTMLElement);
    }
    
    // Interrupt
    const interruptContainer = this.container?.querySelector('#interrupt-content');
    if (interruptContainer) {
      new Interrupt(interruptContainer as HTMLElement);
    }
    
    // Social Feed
    const socialFeedContainer = this.container?.querySelector('#social-feed');
    if (socialFeedContainer) {
      new SocialFeed(socialFeedContainer as HTMLElement);
    }
    
    // Toolbox
    const toolboxContainer = this.container?.querySelector('#toolbox');
    if (toolboxContainer) {
      new Toolbox(toolboxContainer as HTMLElement);
    }
    
    // Idea Generator
    const ideaContainer = this.container?.querySelector('#idea-generator-content');
    if (ideaContainer) {
      new IdeaGenerator(ideaContainer as HTMLElement);
    }
    
    // Campaign Universe
    const campaignContainer = this.container?.querySelector('#campaign-universe');
    if (campaignContainer) {
      new CampaignUniverse(campaignContainer as HTMLElement);
    }
    
    // Live Culture Wall
    const cultureContainer = this.container?.querySelector('#live-culture-wall');
    if (cultureContainer) {
      new LiveCultureWall(cultureContainer as HTMLElement);
    }
    
    // The Algorithm
    const algorithmContainer = this.container?.querySelector('#the-algorithm');
    if (algorithmContainer) {
      new TheAlgorithm(algorithmContainer as HTMLElement);
    }
    
    // Performance
    const performanceContainer = this.container?.querySelector('#performance');
    if (performanceContainer) {
      new Performance(performanceContainer as HTMLElement);
    }
    
    // Human Section
    const humanContainer = this.container?.querySelector('#human-section');
    if (humanContainer) {
      new HumanSection(humanContainer as HTMLElement);
    }
    
    // Manifesto
    const manifestoContainer = this.container?.querySelector('#manifesto-content');
    if (manifestoContainer) {
      new Manifesto(manifestoContainer as HTMLElement);
    }
    
    // About
    const aboutContainer = this.container?.querySelector('#about');
    if (aboutContainer) {
      new About(aboutContainer as HTMLElement);
    }
    
    // People
    const peopleContainer = this.container?.querySelector('#people-content');
    if (peopleContainer) {
      new People(peopleContainer as HTMLElement);
    }
    
    // Contact
    const contactContainer = this.container?.querySelector('#contact');
    if (contactContainer) {
      new Contact(contactContainer as HTMLElement, (formData) => this.handleContactSubmit(formData));
    }
    
    // Attention Signal
    const signalContainer = this.container?.querySelector('#attention-signal');
    if (signalContainer) {
      this.attentionSignal = new AttentionSignal(signalContainer as HTMLElement);
    }
    
    // Live Status
    const statusContainer = this.container?.querySelector('#live-status');
    if (statusContainer) {
      this.liveStatus = new LiveStatus(statusContainer as HTMLElement);
    }
    
    // Final Screen
    const finalContainer = this.container?.querySelector('#final-screen');
    if (finalContainer) {
      this.finalScreen = new FinalScreen(finalContainer as HTMLElement);
    }

    // Case Study Viewer (opened from the Campaign Universe)
    const caseStudyContainer = this.container?.querySelector('#case-study');
    if (caseStudyContainer) {
      this.caseStudy = new CaseStudyViewer(caseStudyContainer as HTMLElement);
      window.addEventListener('enterCaseStudy', this.onEnterCaseStudy);
    }
  }
  
  private setupScrollTriggers(): void {
    // Update navigation active state on scroll
    this.sections.forEach(section => {
      const sectionId = section.getAttribute('data-section');
      if (!sectionId) return;
      
      createScrollTrigger({
        id: `nav-${sectionId}`,
        element: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.navigation?.setActive(sectionId),
        onEnterBack: () => this.navigation?.setActive(sectionId),
      });
    });
    
    // Trigger attention signal pulses at key moments
    const keySections = ['enter', 'interrupt', 'discover', 'create', 'amplify', 'measure', 'remember', 'connect'];
    keySections.forEach((sectionId, index) => {
      const section = this.container?.querySelector(`[data-section="${sectionId}"]`) as HTMLElement | null;
      if (section) {
        createScrollTrigger({
          id: `signal-${sectionId}`,
          element: section,
          start: 'top center',
          onEnter: () => this.attentionSignal?.pulse(sectionId),
        });
      }
    });
  }
  
  private async handleContactSubmit(formData: FormData): Promise<void> {
    // Show loading state
    this.finalScreen?.showLoading();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success
      this.finalScreen?.showSuccess();
      
      // Track attention level
      this.attentionSignal?.setLevel(100);
    } catch (error) {
      this.finalScreen?.showError();
      console.error('[App] Contact submission failed:', error);
    }
  }
  
  destroy(): void {
    this.navigation?.destroy();
    this.attentionSignal?.destroy();
    this.liveStatus?.destroy();
    this.finalScreen?.destroy();
    this.caseStudy?.destroy();
    window.removeEventListener('enterCaseStudy', this.onEnterCaseStudy);
  }
}

// Global access for debugging
(window as any).__app = App;