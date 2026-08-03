/**
 * AudioManager – Spatial Audio + Frequency EQ für GameBoy-wahren Sound.
 *
 * Features:
 * - 3D Audio-Positionierung relative zum Spieler
 * - Low/Mid/High EQ-Presets
 * - WebAudio Oszillator-basierte Platzhalter-Sounds (keine externen Assets!)
 * - Ambient-Loop mit Crossfade
 */

import { Scene } from 'phaser';

export type SoundType = 'ambient_loop' | 'sfx_jump' | 'sfx_attack' | 'sfx_hit' | 'sfx_dash';

interface EQPreset {
  lowGain: number;
  lowMidGain: number;
  highMidGain: number;
  highGain: number;
}

export class AudioManager {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private lowShelf: BiquadFilterNode;
  private highShelf: BiquadFilterNode;
  private players: Map<string, { x: number; y: number }> = new Map();
  private ambientOsc: OscillatorNode | null = null;
  private isEnabled = true;

  private static readonly EQ_PRESETS: Record<SoundType, EQPreset> = {
    ambient_loop: { lowGain: 1.41, lowMidGain: 1.26, highMidGain: 0.89, highGain: 0.71 },
    sfx_jump: { lowGain: 1.0, lowMidGain: 1.12, highMidGain: 1.26, highGain: 1.0 },
    sfx_attack: { lowGain: 1.26, lowMidGain: 1.41, highMidGain: 1.0, highGain: 0.89 },
    sfx_hit: { lowGain: 1.0, lowMidGain: 1.12, highMidGain: 1.26, highGain: 1.41 },
    sfx_dash: { lowGain: 1.58, lowMidGain: 0.8, highMidGain: 1.0, highGain: 1.12 }
  };

  constructor(_scene: Scene) {
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

  private applyEQ(soundType: SoundType): void {
    const preset = AudioManager.EQ_PRESETS[soundType];
    if (!preset) return;
    this.lowShelf.gain.value = Math.log2(preset.lowGain) * 6;
    this.highShelf.gain.value = Math.log2(preset.highGain) * 6;
    this.masterGain.gain.value = 0.7 * preset.lowMidGain;
  }

  public playSFX(type: SoundType, x?: number, y?: number): void {
    if (!this.isEnabled) return;
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
    // Stop existing ambient
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
      } catch { /* already stopped */ }
    }

    this.applyEQ(type);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 85;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 5);
    osc.connect(gain);
    gain.connect(this.lowShelf);
    osc.start();
    this.ambientOsc = osc;
    this.presetAmbientTimeout = setTimeout(() => this.ambientOsc?.stop(), 5000) as ReturnType<typeof setTimeout>;
  }

  private presetAmbientTimeout: any = null;

  public resume(): void {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.setAmbient('ambient_loop');
      });
    } else {
      this.setAmbient('ambient_loop');
    }
  }

  public registerPlayer(x: number, y: number): void {
    this.players.set('player', { x, y });
  }

  /**
   * Aktualisiert die Spielerposition für spatiales Audio.
   * Muss pro Frame aufgerufen werden.
   */
  public update(x: number, y: number): void {
    this.players.set('player', { x, y });
  }

  public setVolume(volume: number): void {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume)) * 0.7;
  }

  public destroy(): void {
    if (this.presetAmbientTimeout) clearTimeout(this.presetAmbientTimeout);
    this.ambientOsc?.stop();
    this.ctx.close();
    this.isEnabled = false;
  }
}
