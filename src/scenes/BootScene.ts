import { Scene } from 'phaser';
import { PlaceholderAssetGenerator } from '../systems/AssetGenerator';
import { AnimationState } from '../systems/AnimationSystem';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generatePlaceholderTextures();
    // Transition to GameScene (nach kurzer Verzögerung für Texture-Registrierung)
    this.scene.start('GameScene');
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

    // --- Background-Layer (Paralax) ---
    PlaceholderAssetGenerator.generateBackgroundLayer(this);

    // --- Tilesheet ---
    PlaceholderAssetGenerator.generateTilesheet(this);

    // --- Collectible-Textures ---
    PlaceholderAssetGenerator.generateCollectibleTexture(this, 'health');
    PlaceholderAssetGenerator.generateCollectibleTexture(this, 'mana');
    PlaceholderAssetGenerator.generateCollectibleTexture(this, 'speed_boost');

    // --- Checkpoint ---
    PlaceholderAssetGenerator.generateCheckpointTexture(this);

    // --- Particle ---
    PlaceholderAssetGenerator.generateParticleTexture(this);

    // --- Platform-Texturen (Tilesheet-basiert) ---
    // Large platform (1280x40) with stone tile pattern
    const platLarge = this.add.renderTexture(0, 0, 1280, 40);
    for (let x = 0; x < 1280; x += 32) {
      platLarge.draw('tilesheet', x, 20, 3);  // Stone tile (index 3)
    }
    platLarge.saveTexture('platform_large');
    platLarge.destroy();

    // Small platform (120x20) with grassy stone edge
    const platSmall = this.add.renderTexture(0, 0, 120, 20);
    for (let x = 0; x < 120; x += 32) {
      const frame = (x % 64 === 0) ? 1 : 3; // Grass-Top, Stone-Seiten
      platSmall.draw('tilesheet', x, 10, frame);
    }
    platSmall.saveTexture('platform_small');
    platSmall.destroy();
  }
}
