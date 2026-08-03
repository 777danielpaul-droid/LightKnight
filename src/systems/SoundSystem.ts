/**
 * SoundSystem – WebAudio-Manager für Ambient, SFX & UI-Sounds.
 * Nutzt WebAudio-API für dynamische Sound-Generierung (keine externen Assets).
 */

export type SoundCategory = 'ambient' | 'sfx' | 'ui' | 'music';

interface SoundConfig {
  category: SoundCategory;
  volume: number;
  loop: boolean;
  spatial: boolean;
  decay?: number; // Sekunden, über die der Sound verlischt
}

export class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private categoryGains: Map<SoundCategory, GainNode> = new Map();
  private sounds: Map<string, AudioBuffer> = new Map();
  private muted: boolean = false;

  constructor() {
    void this.init().catch(console.error);
  }

  /**
   * Initialisiert WebAudioContext (muss Benutzer-Interaktion warten).
   */
  async init(): Promise<void> {
    if (this.ctx) return;

    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);

    // Kategorie-Gains (Master-Mix)
    this.createCategoryGain('ambient', 0.3);
    this.createCategoryGain('sfx', 0.7);
    this.createCategoryGain('ui', 0.8);
    this.createCategoryGain('music', 0.6);
  }

  private createCategoryGain(category: SoundCategory, volume: number): void {
    if (!this.ctx || !this.masterGain) return;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);
    this.categoryGains.set(category, gain);
  }

  /**
   * Generiert einen dynamischen Sound und speichert ihn.
   * Verwendet für Platzhalter-Sounds bis echte Assets verfügbar sind.
   */
  async generateSound(name: string, config: {
    type: 'noise' | 'sine' | 'square' | 'sawtooth' | 'triangle';
    frequency: number;
    duration: number;
    attack?: number;
    decay?: number;
  }): Promise<void> {
    if (!this.ctx) return;

    const sampleRate = this.ctx.sampleRate;
    const numSamples = Math.ceil(sampleRate * config.duration);
    const buffer = this.ctx.createBuffer(2, numSamples, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      const isRight = channel === 1;

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const progress = i / numSamples;

        let sample = 0;

        if (config.type === 'noise') {
          sample = (Math.random() * 2 - 1) * (1 - progress);
        } else {
          // Rechte Spur leicht versetzt für Spatial-Effekt
          const freqAdjust = isRight ? 1.005 : 0.995;
          if (config.type === 'sine') {
            sample = Math.sin(2 * Math.PI * config.frequency * freqAdjust * t);
          } else if (config.type === 'square') {
            sample = Math.sign(Math.sin(2 * Math.PI * config.frequency * freqAdjust * t));
          } else if (config.type === 'sawtooth') {
            sample = 2 * ((config.frequency * freqAdjust * t) % 1) - 1;
          } else if (config.type === 'triangle') {
            sample = 2 * Math.asin(Math.sin(2 * Math.PI * config.frequency * freqAdjust * t)) / Math.PI;
          }
        }

        // Envelope
        const attack = config.attack || 0.01;
        const decay = config.decay || 0.1;
        let envelope = 1;
        if (progress < attack) {
          envelope = progress / attack;
        } else if (progress > decay) {
          envelope = 1 - ((progress - decay) / (1 - decay));
        }

        channelData[i] = sample * envelope;
      }
    }

    this.sounds.set(name, buffer);
  }

  /**
   * Spiele einen registrierten Sound ab.
   */
  async play(name: string, customVolume?: number): Promise<void> {
    if (!this.ctx || !this.sounds.has(name) || this.muted) {
      return;
    }

    // Resume AudioContext bei Bedarf
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const config = this.getSoundConfig(name);
    const categoryGain = this.categoryGains.get(config.category) ?? this.masterGain;

    await this.playBuffer(this.sounds.get(name)!, categoryGain, customVolume);
  }

  private async playBuffer(
    buffer: AudioBuffer,
    destination: GainNode | null,
    customVolume?: number
  ): Promise<void> {
    if (!this.ctx || !destination) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    if (customVolume !== undefined) {
      const volGain = this.ctx.createGain();
      volGain.gain.value = customVolume;
      source.connect(volGain);
      volGain.connect(destination);
    } else {
      source.connect(destination);
    }

    source.start(0);
    await new Promise<void>((resolve) => {
      source.onended = () => resolve();
    });
  }

  private getSoundConfig(name: string): SoundConfig {
    // Standard-Konfigurationen
    const configs: Record<string, { category: SoundCategory; volume: number; loop: boolean; spatial: boolean }> = {
      ambient_dungeon: { category: 'ambient', volume: 0.2, loop: true, spatial: false },
      sfx_jump: { category: 'sfx', volume: 0.6, loop: false, spatial: true },
      sfx_land: { category: 'sfx', volume: 0.5, loop: false, spatial: true },
      sfx_attack: { category: 'sfx', volume: 0.7, loop: false, spatial: true },
      sfx_dash: { category: 'sfx', volume: 0.6, loop: false, spatial: true },
      sfx_hit: { category: 'sfx', volume: 0.6, loop: false, spatial: true },
      sfx_step: { category: 'sfx', volume: 0.3, loop: false, spatial: true },
      ui_menu_open: { category: 'ui', volume: 0.8, loop: false, spatial: false },
      music_intro: { category: 'music', volume: 0.4, loop: true, spatial: false },
    };

    return configs[name] || { category: 'sfx', volume: 0.5, loop: false, spatial: true };
  }

  /**
   * Mute / Unmute aller Sounds.
   */
  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 1;
    }
    return this.muted;
  }

  /**
   * Generiert alle Standard-Platzhalter-Sounds.
   */
  async initDefaultSounds(): Promise<void> {
    await this.generateSound('ambient_dungeon', {
      type: 'noise',
      frequency: 80,
      duration: 2,
      attack: 0,
      decay: 0.5
    });

    await this.generateSound('sfx_jump', {
      type: 'square',
      frequency: 220,
      duration: 0.3,
      attack: 0.01,
      decay: 0.29
    });

    await this.generateSound('sfx_land', {
      type: 'sine',
      frequency: 120,
      duration: 0.3,
      attack: 0,
      decay: 0.3
    });

    await this.generateSound('sfx_attack', {
      type: 'sawtooth',
      frequency: 400,
      duration: 0.2,
      attack: 0,
      decay: 0.2
    });

    await this.generateSound('sfx_dash', {
      type: 'noise',
      frequency: 200,
      duration: 0.4,
      attack: 0,
      decay: 0.4
    });

    await this.generateSound('sfx_hit', {
      type: 'square',
      frequency: 80,
      duration: 0.2,
      attack: 0,
      decay: 0.2
    });

    await this.generateSound('sfx_step', {
      type: 'noise',
      frequency: 100,
      duration: 0.05,
      attack: 0,
      decay: 0.05
    });

    await this.generateSound('music_intro', {
      type: 'sine',
      frequency: 60,
      duration: 0.5,
      attack: 0.1,
      decay: 0.4
    });

    await this.generateSound('ui_menu_open', {
      type: 'triangle',
      frequency: 800,
      duration: 0.15,
      attack: 0,
      decay: 0.15
    });
  }
}

// Singleton-Muster (einmalige Instanz)
export const soundSystem = new SoundSystem();
