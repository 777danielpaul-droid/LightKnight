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

  /**
   * Generiert ein 512x256 Tilesheet mit verschiedenen Stein- und Decor-Tiles.
   * Jeder Tile ist 32x32 Pixel → 16x8 Tiles.
   * Tile-Indizes:
   * 0-2: Gras-Blocke (hellblau bis dunkelblau)
   * 3-5: Stein-Blocke (grau)
   * 6-7: Stein mit Moos (grüner Akzent)
   * 8-9: Ladder (Holz)
   * 10-11: Kerze (mit Flamme)
   * 12-15: Leere Tiles (Luft)
   */
  static generateTilesheet(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const tileSize = 32;
    const cols = 16;
    const rows = 8;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * tileSize;
        const y = row * tileSize;
        const tileIndex = row * cols + col;

        switch (tileIndex) {
          // --- Grass Blocks ---
          case 0: // Hellste Gras-Ebene (oben)
            gfx.fillStyle(0x3a7ca5);
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x2d5a7a);
            gfx.fillRect(x, y, tileSize, 8); // Grasrand oben
            break;
          case 1: // Mittel-Gras
            gfx.fillStyle(0x2d6a8c);
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x1d4a6a);
            gfx.fillRect(x, y, tileSize, 8);
            break;
          case 2: // Dunkel-Gras
            gfx.fillStyle(0x1d5a7a);
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x0d3a5a);
            gfx.fillRect(x, y, tileSize, 6);
            break;

          // --- Stone Blocks ---
          case 3:
            gfx.fillStyle(0x6a6a6a);
            gfx.fillRect(x, y, tileSize, tileSize);
            break;
          case 4:
            gfx.fillStyle(0x5a5a5a);
            gfx.fillRect(x, y, tileSize, tileSize);
            break;
          case 5:
            gfx.fillStyle(0x7a7a7a);
            gfx.fillRect(x, y, tileSize, tileSize);
            break;

          // --- Stone with Moss ---
          case 6:
            gfx.fillStyle(0x6a6a6a);
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x3a7a3a); // Moos-Grün
            gfx.fillRect(x + 4, y + 4, 8, 8);
            gfx.fillRect(x + 20, y + 16, 6, 6);
            break;
          case 7:
            gfx.fillStyle(0x5a5a5a);
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x3a7a3a);
            gfx.fillRect(x + 16, y + 8, 10, 8);
            gfx.fillRect(x + 4, y + 20, 8, 6);
            break;

          // --- Ladder ---
          case 8:
            gfx.fillStyle(0x8b5a2b); // Holz-Braun
            gfx.fillRect(x, y, tileSize, tileSize);
            gfx.fillStyle(0x8b5a2b);
            gfx.fillRect(x, y, 6, tileSize); // Links
            gfx.fillRect(x + 26, y, 6, tileSize); // Rechts
            gfx.fillRect(x + 6, y + 8, 18, 4); // Stufe
            gfx.fillRect(x + 6, y + 18, 18, 4);
            gfx.fillRect(x + 6, y + 28, 18, 4);
            break;

          // --- Candle / Kerze ---
          case 9:
            gfx.fillStyle(0x8b5a2b); // Kerzen-Stand
            gfx.fillRect(x + 14, y, 4, 24);
            gfx.fillStyle(0x3a3a3a);
            gfx.fillRect(x + 10, y + 24, 12, 4); // Basis
            // Flamme
            gfx.fillStyle(0xffaa00);
            gfx.fillCircle(x + 16, y + 4, 4);
            gfx.fillStyle(0xffdd00);
            gfx.fillCircle(x + 16, y + 3, 2);
            // Licht-Halo
            gfx.fillStyle(0xffaa00, 0.3);
            gfx.fillCircle(x + 16, y + 4, 8);
            break;

          // --- Empty / Air tiles ---
          default:
            // Transparent (leer)
            break;
        }
      }
    }

    gfx.generateTexture('tilesheet', cols * tileSize, rows * tileSize);
    gfx.destroy();
  }

  /**
   * Generiert eine 512x256 Background-Ebene mit Weitfern-Hintergrund-Elementen.
   * Für Paralaxeffekte.
   */
  static generateBackgroundLayer(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const width = 512;
    const height = 256;

    // Tieferes Blau für Weitfern
    gfx.fillStyle(0x0a0f2b);
    gfx.fillRect(0, 0, width, height);

    // Entfernte Berge (dunkelviolett)
    gfx.fillStyle(0x2d1a4d, 0.4);
    gfx.fillTriangle(50, height - 50, 120, height - 180, 200, height - 50);
    gfx.fillTriangle(180, height - 40, 280, height - 160, 380, height - 40);
    gfx.fillTriangle(320, height - 60, 420, height - 180, 500, height - 60);

    // Entfernte Lichter (schwach leuchtend)
    gfx.fillStyle(0x00f0ff, 0.3);
    gfx.fillCircle(80, height - 200, 3);
    gfx.fillCircle(220, height - 190, 3);
    gfx.fillCircle(350, height - 220, 3);
    gfx.fillCircle(450, height - 210, 3);

    // Sterne
    gfx.fillStyle(0xffffff, 0.6);
    for (let i = 0; i < 50; i++) {
      const sx = 20 + (i * 37) % (width - 40);
      const sy = 20 + (i * 53) % (height - 40);
      gfx.fillRect(sx, sy, 1, 1);
    }

    gfx.generateTexture('background_layer', width, height);
    gfx.destroy();
  }
}
