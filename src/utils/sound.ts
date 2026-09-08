interface SoundConfig {
  enabled: boolean;
  volume: number;
  sounds: Record<string, HTMLAudioElement>;
}

const soundConfig: SoundConfig = {
  enabled: false,
  volume: 0.3,
  sounds: {},
};

const soundManifest: Record<string, string> = {
  'hover': '/assets/sounds/hover.mp3',
  'click': '/assets/sounds/click.mp3',
  'transition': '/assets/sounds/transition.mp3',
  'success': '/assets/sounds/success.mp3',
  'ambient': '/assets/sounds/ambient.mp3',
};

let ambientSound: HTMLAudioElement | null = null;
let isInitialized = false;

export function initSound(): void {
  if (isInitialized) return;
  isInitialized = true;
  
  // Check for user preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Create sound toggle UI
  createSoundToggle();
  
  // Preload sounds
  preloadSounds();
}

function createSoundToggle(): void {
  const toggle = document.createElement('button');
  toggle.className = 'sound-toggle btn-ghost';
  toggle.setAttribute('aria-label', 'Toggle sound');
  toggle.setAttribute('data-cursor-hover', 'true');
  toggle.innerHTML = `
    <svg class="sound-icon-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
    <svg class="sound-icon-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
    <span class="sound-label">SOUND</span>
  `;
  
  toggle.addEventListener('click', toggleSound);
  
  // Position in bottom right
  Object.assign(toggle.style, {
    position: 'fixed',
    bottom: 'var(--space-6)',
    right: 'var(--space-6)',
    zIndex: 'var(--z-ui)',
    opacity: '0.6',
    transition: 'opacity var(--duration-base) var(--ease-out)',
  });
  
  toggle.addEventListener('mouseenter', () => {
    toggle.style.opacity = '1';
  });
  
  toggle.addEventListener('mouseleave', () => {
    toggle.style.opacity = '0.6';
  });
  
  document.body.appendChild(toggle);
}

function preloadSounds(): void {
  Object.entries(soundManifest).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.volume = soundConfig.volume;
    audio.preload = 'auto';
    soundConfig.sounds[key] = audio;
    
    // Handle missing files gracefully
    audio.addEventListener('error', () => {
      console.debug(`[Sound] Could not load: ${src}`);
    });
  });
  
  // Create ambient loop
  if (soundConfig.sounds.ambient) {
    ambientSound = soundConfig.sounds.ambient;
    ambientSound.loop = true;
  }
}

function toggleSound(): void {
  soundConfig.enabled = !soundConfig.enabled;
  
  const toggle = document.querySelector('.sound-toggle') as HTMLElement;
  const iconOn = toggle?.querySelector('.sound-icon-on') as HTMLElement;
  const iconOff = toggle?.querySelector('.sound-icon-off') as HTMLElement;
  
  if (soundConfig.enabled) {
    iconOn?.style.setProperty('display', 'block');
    iconOff?.style.setProperty('display', 'none');
    playAmbient();
  } else {
    iconOn?.style.setProperty('display', 'none');
    iconOff?.style.setProperty('display', 'block');
    stopAmbient();
  }
  
  // Play click sound for feedback
  if (soundConfig.enabled) {
    play('click');
  }
}

export function play(soundName: string): void {
  if (!soundConfig.enabled) return;
  
  const sound = soundConfig.sounds[soundName];
  if (!sound) return;
  
  // Clone for overlapping plays
  const clone = sound.cloneNode() as HTMLAudioElement;
  clone.volume = soundConfig.volume;
  clone.play().catch(() => {
    // Ignore autoplay policy errors
  });
}

export function playAmbient(): void {
  if (!soundConfig.enabled || !ambientSound) return;
  
  ambientSound.volume = soundConfig.volume * 0.15;
  ambientSound.play().catch(() => {
    // Ignore autoplay policy errors
  });
}

export function stopAmbient(): void {
  if (ambientSound) {
    ambientSound.pause();
    ambientSound.currentTime = 0;
  }
}

export function setVolume(volume: number): void {
  soundConfig.volume = Math.max(0, Math.min(1, volume));
  
  Object.values(soundConfig.sounds).forEach(sound => {
    sound.volume = soundConfig.volume;
  });
  
  if (ambientSound) {
    ambientSound.volume = soundConfig.volume * 0.15;
  }
}

export function isSoundEnabled(): boolean {
  return soundConfig.enabled;
}

export function destroySound(): void {
  stopAmbient();
  Object.values(soundConfig.sounds).forEach(sound => {
    sound.pause();
    sound.src = '';
  });
  soundConfig.sounds = {};
  
  const toggle = document.querySelector('.sound-toggle');
  toggle?.remove();
}