import { Scene } from 'phaser';
import { PlaceholderAssetGenerator } from '../systems/AssetGenerator';
import { AnimationState } from '../systems/AnimationSystem';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generatePlaceholderTextures();
    // Lade das 3D-Level-Design-Bild
    this.load.image('hollow_cave_preview', '/assets/hollow_cave_preview.png');
    this.load.once('complete', () => {
      // Transition to GameScene (nach kurzer Verzögerung für Texture-Registrierung)
      this.scene.start('GameScene');
    });
    this.load.start();
  }

  private generatePlaceholderTextures(): void {
    // --- Player-Animation-Frames (wird von AnimationSystem erwartet) ---
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
          this,
          `${state}_${i}`,
          config.color
        );
      }
    });

    // --- Player-Spritesheet (Fallback) ---
    PlaceholderAssetGenerator.generatePlayerSpritesheet(this);

    // --- Weapon ---
    PlaceholderAssetGenerator.generateWeaponTexture(this);

    // --- Enemy ---
    PlaceholderAssetGenerator.generateEnemyTexture(this);

    // --- Hit-Effect ---
    PlaceholderAssetGenerator.generateHitEffectTexture(this);

    // --- Particle ---
    PlaceholderAssetGenerator.generateParticleTexture(this);

    // --- Plattform-Textur (einmalig, wiederverwendbar) ---
    const platTex = this.add.renderTexture(0, 0, 1280, 40);
    platTex.draw(this.add.rectangle(640, 20, 1280, 40, 0x2d1a4d), 0, 0);
    platTex.saveTexture('platform_large');
    platTex.destroy();

    const platSmallTex = this.add.renderTexture(0, 0, 120, 20);
    platSmallTex.draw(this.add.rectangle(60, 10, 120, 20, 0x2d1a4d), 0, 0);
    platSmallTex.saveTexture('platform_small');
    platSmallTex.destroy();
  }
}
