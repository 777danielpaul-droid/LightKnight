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
      gfx.fillStyle(colors[i]!);
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

  static generatePlayerFrame(scene: Scene, key: string, color: number): void {
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

  static generateCollectibleTexture(scene: Scene, type: 'health' | 'mana' | 'speed_boost'): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    // Hintergrund-Kreis
    gfx.fillStyle(0x1a1a2e);
    gfx.fillCircle(12, 12, 10);
    // Type-spezifische Farbe + Symbol
    switch (type) {
      case 'health':
        gfx.fillStyle(0xff4444);  // Rot
        gfx.fillCircle(12, 12, 7);
        // Herz-Symbol (vereinfacht)
        gfx.fillStyle(0xff1111);
        gfx.fillTriangle(8, 12, 12, 6, 16, 12);
        gfx.fillRect(9, 12, 6, 5);
        break;
      case 'mana':
        gfx.fillStyle(0x44aaff);  // Blau
        gfx.fillCircle(12, 12, 7);
        // Blitz
        gfx.fillStyle(0xffff00);
        gfx.beginPath();
        gfx.moveTo(12, 5);
        gfx.lineTo(16, 16);
        gfx.lineTo(10, 16);
        gfx.lineTo(14, 22);
        gfx.lineTo(8, 12);
        gfx.lineTo(12, 12);
        gfx.fillPath();
        break;
      case 'speed_boost': {
        gfx.fillStyle(0xffaa00);  // Gold
        gfx.fillCircle(12, 12, 7);
        // Stern
        gfx.fillStyle(0xffff00);
        gfx.beginPath();
        const spikes = 5;
        const outer = 7;
        const inner = 3;
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes;
          const r = i % 2 === 0 ? outer : inner;
          gfx.lineTo(12 + Math.cos(angle) * r, 12 + Math.sin(angle) * r);
        }
        gfx.fillPath();
        break;
      }
    }
    gfx.generateTexture(`collectible_${type}`, 24, 24);
    gfx.destroy();
  }

  static generateCheckpointTexture(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    // Torbogen
    gfx.fillStyle(0x00f0ff);  // Cyan
    gfx.fillRect(0, 0, 32, 48);
    // Tor-Mittelstück (dunkler)
    gfx.fillStyle(0x0a0f2b);
    gfx.fillRect(4, 4, 24, 40);
    // Leuchtender Rand
    gfx.lineStyle(2, 0xa400ff, 0.8);  // Magenta
    gfx.strokeRect(2, 2, 28, 44);
    // Animated-Flag (links unten)
    gfx.fillStyle(0xa400ff);
    gfx.fillTriangle(0, 40, 12, 34, 12, 46);
    gfx.generateTexture('checkpoint', 32, 48);
    gfx.destroy();
  }
}
