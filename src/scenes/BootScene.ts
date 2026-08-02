import { Scene } from 'phaser';
import { PlaceholderAssetGenerator } from '../systems/AssetGenerator';

/**
 * BootScene – der erste Start-Bereich.
 * Lädt Assets und initialisiert das Spiel.
 */

export class BootScene extends Scene {
  static readonly KEY = 'BootScene';

  constructor() {
    super(BootScene.KEY);
  }

  preload(): void {
    this.load.setPath('assets');
  }

  create(): void {
    // Generiere alle Platzhalter-Assets
    PlaceholderAssetGenerator.generatePlayerSpritesheet(this);
    PlaceholderAssetGenerator.generateWeaponTexture(this);
    PlaceholderAssetGenerator.generateEnemyTexture(this);
    PlaceholderAssetGenerator.generateParticleTexture(this);
    PlaceholderAssetGenerator.generateHitEffectTexture(this);

    // Wechsel zur GameScene (async für sichere Texture-Registrierung)
    this.time.delayedCall(100, () => {
      this.scene.start('GameScene');
    });
  }
}
