/**
 * Asset-Generatoren für Milestone 2.
 * Erstellt Platzhalter-Sprites für Player, Weapon, Enemy und Partikel
 * als generierte Texturen (ersetzt später durch echte Assets).
 */

import { Scene } from 'phaser';

export class PlaceholderAssetGenerator {
  static generatePlayerSpritesheet(scene: Scene): void {
    const frames = 4;
    const frameW = 32;
    const frameH = 48;
    const totalW = frameW * frames;
    const totalH = frameH;

    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const colors = [0x00aaff, 0x0099e6, 0x0088cc, 0x0077b3]; // Abwechslung für Animation

    for (let i = 0; i < frames; i++) {
      gfx.fillStyle(colors[i]);
      gfx.fillRect(i * frameW, 0, frameW, frameH);
      // Auge (weißer Punkt)
      gfx.fillStyle(0xffffff);
      gfx.fillRect(i * frameW + 10, 15, 6, 6);
    }
    gfx.generateTexture('player_spritesheet', totalW, totalH);
    gfx.destroy();
  }

  static generateWeaponTexture(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(0xffaa00); // Goldene Waffe
    gfx.fillRect(0, 0, 16, 48);
    // Griff
    gfx.fillStyle(0x8b4513);
    gfx.fillRect(4, 0, 8, 20);
    // Kopf
    gfx.fillStyle(0xffaa00);
    gfx.fillCircle(8, 32, 8);
    gfx.generateTexture('weapon', 16, 48);
    gfx.destroy();
  }

  static generateEnemyTexture(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(0xaa0055); // Dunkelviolett
    gfx.fillRect(0, 0, 24, 24);
    // Augen
    gfx.fillStyle(0xff0000);
    gfx.fillRect(4, 6, 4, 4);
    gfx.fillRect(16, 6, 4, 4);
    gfx.generateTexture('enemy', 24, 24);
    gfx.destroy();
  }

  static generateParticleTexture(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(0x00ffff);
    gfx.fillCircle(8, 8, 8);
    gfx.generateTexture('particle', 16, 16);
    gfx.destroy();
  }

  static generatePlayerFrame(scene: Scene, key: string, color: number, frameIndex: number): void {
    const frameW = 32;
    const frameH = 48;
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(color);
    gfx.fillRect(0, 0, frameW, frameH);
    // Auge (weißer Punkt)
    gfx.fillStyle(0xffffff);
    gfx.fillRect(10, 15, 6, 6);
    gfx.generateTexture(key, frameW, frameH);
    gfx.destroy();
  }

  static generateHitEffectTexture(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    gfx.fillStyle(0xff5500);
    gfx.fillCircle(8, 8, 8);
    gfx.generateTexture('hit_effect', 16, 16);
    gfx.destroy();
  }
}
