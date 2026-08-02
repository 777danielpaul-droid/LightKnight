import { Scene } from 'phaser';

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
    // Platzhalter für spätere Asset-Preload-Logik
    this.load.setPath('assets');
    // this.load.image('atlas', 'sprites/player-atlas.json');
  }

  create(): void {
    // Generiere Platzhalter-Textur für Player (32x48 blaue Box)
    const gfx = this.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(0x00aaff);
    gfx.fillRect(0, 0, 32, 48);
    gfx.generateTexture('player_idle', 32, 48);
    gfx.destroy();

    // Wechsle zur GameScene
    this.scene.start('GameScene');
  }
}
