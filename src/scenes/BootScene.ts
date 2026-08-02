import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generatePlaceholderTextures();
    this.scene.start('GameScene');
  }

  private generatePlaceholderTextures(): void {
    // Player (blau, 24x32)
    const playerTex = this.add.renderTexture(0, 0, 24, 32);
    playerTex.draw(this.add.rectangle(12, 16, 24, 32, 0x3a86ff), 0, 0);
    playerTex.saveTexture('player');
    playerTex.destroy();

    // Plattform-Textur (einmalig, wiederverwendbar)
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
