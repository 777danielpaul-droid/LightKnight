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
    // Alle Szenen sind registriert – wechsle zur GameScene
    this.scene.start('GameScene');
  }
}
