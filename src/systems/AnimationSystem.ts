/**
 * AnimationSystem – verwaltet Animation-States für Entities.
 * Nutzt einzelne Texturen (nicht Spritesheet-Indices) für Kompatibilität
 * mit Phaser's generateTexture, das keine Frame-Indizes registriert.
 */

import { Scene, Physics } from 'phaser';
import { PlaceholderAssetGenerator } from './AssetGenerator';

export type AnimationState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'dash';

interface AnimationConfig {
  key: string;
  textures: string[];
  frameRate: number;
  repeat: number;
}

export class AnimationSystem {
  private scene: Scene;
  private currentState: AnimationState = 'idle';

  constructor(scene: Scene) {
    this.scene = scene;
    this.createFrameTextures();
    this.createAnimations();
  }

  private createFrameTextures(): void {
    // Generiere einzelne Texturen für jeden Animations-Frame
    // (Phaser generateTexture registriert keine Frame-Indizes in Spritesheets)
    const frameConfigs: Record<AnimationState, { color: number; count: number }> = {
      idle: { color: 0x00aaff, count: 4 },
      run: { color: 0x0099e6, count: 4 },
      jump: { color: 0x0088cc, count: 2 },
      fall: { color: 0x0077b3, count: 2 },
      dash: { color: 0x0066a3, count: 2 }
    };

    Object.entries(frameConfigs).forEach(([state, config]) => {
      for (let i = 0; i < config.count; i++) {
        PlaceholderAssetGenerator.generatePlayerFrame(
          this.scene,
          `${state}_${i}`,
          config.color,
          i
        );
      }
    });
  }

  private animConfigs: Record<AnimationState, AnimationConfig> = {
    idle: { key: 'player_idle_anim', textures: ['idle_0', 'idle_1', 'idle_2', 'idle_3'], frameRate: 4, repeat: -1 },
    run: { key: 'player_run_anim', textures: ['run_0', 'run_1', 'run_2', 'run_3'], frameRate: 8, repeat: -1 },
    jump: { key: 'player_jump_anim', textures: ['jump_0', 'jump_1'], frameRate: 2, repeat: 0 },
    fall: { key: 'player_fall_anim', textures: ['fall_0', 'fall_1'], frameRate: 2, repeat: 0 },
    dash: { key: 'player_dash_anim', textures: ['dash_0', 'dash_1'], frameRate: 10, repeat: 0 }
  };

  private createAnimations(): void {
    Object.entries(this.animConfigs).forEach(([state, config]) => {
      this.scene.anims.create({
        key: config.key,
        frames: config.textures.map(tex => ({ key: tex })),
        frameRate: config.frameRate,
        repeat: config.repeat
      });
    });
  }

  play(sprite: Physics.Arcade.Sprite, state: AnimationState): void {
    if (state === this.currentState) return;

    const config = this.animConfigs[state];
    sprite.play(config.key, true);
    this.currentState = state;
  }

  getCurrentState(): AnimationState {
    return this.currentState;
  }
}
