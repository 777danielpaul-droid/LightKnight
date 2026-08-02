import { Scene } from 'phaser';

/**
 * GameScene – Hauptspielszene (wird in späteren Milestones gefüllt).
 */

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.add.text(100, 100, 'LightKnight – Lumenfall', {
      fontFamily: 'mono',
      fontSize: '24px',
      color: '#00f0ff'
    });
  }
}
