/**
 * AudioManager – Spatial Audio + Frequency EQ für GameBoy-wahren Sound.
 *
 * Features:
 * - 3D Audio-Positionierung relative zum Spieler
 * - Low/Mid/High EQ-Presets (tief, warm, #7b1e2b inspiriert)
 * - Ambient-Loop-Layers mit Crossfade
 * - WebAudio Oszillator-basierte Platzhalter-Sounds
 */

import { Scene } from 'phaser';

export type SoundType = 'ambient_loop' | 'sfx_jump' | 'sfx_attack' | 'sfx_hit' | 'sfx_dash';

interface EQPreset {
  lowGain: number;
  lowMidGain: number;
  highMidGain: number;
  highGain: number;
  filterQ: number;
  filterFreq: number;
}

export class AudioManager {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private lowShelf: BiquadFilterNode;
  private highShelf: BiquadFilterNode;
  private players: Map<string, { x: number; y: number }> = new Map();
  private ambientSource: OscillatorNode | null = null;
  private currentAmbient: SoundType | null = null;

  private static readonly EQ_PRESETS: Record<SoundType, EQPreset> = {
    ambient_loop: {
      lowGain: 1.41,
      lowMidGain: 1.26,
      highMidGain: 0.89,
      highGain: 0.71,
      filterQ: 0.7,
      filterFreq: 400
    },
    sfx_jump: {
      lowGain: 1.0,
      lowMidGain: 1.12,
      highMidGain: 1.26,
      highGain: 1.0,
      filterQ: 0.8,
      filterFreq: 800
    },
    sfx_attack: {
      lowGain: 1.26,
      lowMidGain: 1.41,
      highMidGain: 1.0,
      highGain: 0.89,
      filterQ: 1.0,
      filterFreq: 300
    },
    sfx_hit: {
      lowGain: 1.0,
      lowMidGain: 1.12,
      highMidGain: 1.26,
      highGain: 1.41,
      filterQ: 0.7,
      filterFreq: 1200
    },
    sfx_dash: {
      lowGain: 1.58,
      lowMidGain: 0.8,
      highMidGain: 1.0,
      highGain: 1.12,
      filterQ: 0.5,
      filterFreq: 200
    }
  };

  constructor(_scene: Scene) {
    // WebAudio Context direkt erstellen (Browser-kompatibel)
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);

    this.lowShelf = this.ctx.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 200;

    this.highShelf = this.ctx.createBiquadFilter();
    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 2000;

    this.lowShelf.connect(this.highShelf);
    this.highShelf.connect(this.masterGain);
  }

  public applyEQ(soundType: SoundType): void {
    const preset = AudioManager.EQ_PRESETS[soundType];
    if (!preset) return;
    this.lowShelf.gain.value = Math.log2(preset.lowGain) * 6;
    this.highShelf.gain.value = Math.log2(preset.highGain) * 6;
    this.masterGain.gain.value = 0.7 * preset.lowMidGain;
  }

  public playSFX(type: SoundType, x?: number, y?: number): void {
    const preset = AudioManager.EQ_PRESETS[type];

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    switch (type) {
      case 'sfx_jump':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.3 * preset.lowGain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        break;
      case 'sfx_attack':
        osc.type = 'square';
        osc.frequency.value = 80;
        gainNode.gain.setValueAtTime(0.4 * preset.lowMidGain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        break;
      case 'sfx_hit':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.25 * preset.highGain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        break;
      case 'sfx_dash':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.35 * preset.lowGain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        break;
      case 'ambient_loop':
        osc.type = 'triangle';
        osc.frequency.value = 85;
        gainNode.gain.setValueAtTime(0.15 * preset.lowGain, this.ctx.currentTime);
        break;
    }

    // Spatial-Panning
    if (x !== undefined && y !== undefined) {
      const pan = this.ctx.createStereoPanner();
      const player = this.players.get('player');
      if (player) {
        const dx = x - player.x;
        pan.pan.value = Math.max(-1, Math.min(1, dx / 800));
      }
      osc.connect(gainNode);
      gainNode.connect(pan);
      pan.connect(this.lowShelf);
    } else {
      osc.connect(gainNode);
      gainNode.connect(this.lowShelf);
    }

    osc.start();
    const dur = type === 'ambient_loop' ? 9999 : (type === 'sfx_attack' ? 0.15 : 0.4);
    osc.stop(this.ctx.currentTime + dur);
  }

  public setAmbient(type: SoundType): void {
    if (this.currentAmbient === type) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 85;

    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2);

    osc.connect(gainNode);
    gainNode.connect(this.lowShelf);

    if (this.ambientSource) {
      this.ambientSource.stop(this.ctx.currentTime + 2);
    }

    osc.start();
    this.ambientSource = osc;
    this.currentAmbient = type;
    this.applyEQ(type);
  }

  public registerPlayer(x: number, y: number): void {
    this.players.set('player', { x, y });
  }

  public setVolume(volume: number): void {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume)) * 0.7;
  }

  public destroy(): void {
    this.ctx.close();
  }
}
