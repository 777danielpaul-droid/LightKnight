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
   * Generiert eine 1024x720 Hintergrund-Textur mit mehreren
   * atmosphärischen Ebenen und Lichtquellen.
   * Stil: dunkle Höhle mit violettem Schimmer und isolierten Lichtern.
   */
  static generateAtmosphericBackground(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const width = 1024;
    const height = 720;

    // --- Hintergrund: dunkler Verlauf (Tiefblau → violett) ---
    for (let y = 0; y < height; y += 2) {
      const t = y / height;
      // Tiefblau oben (#0a0f2b) → dunkles Violett unten (#1e0f33)
      const r = Math.floor(10 * (1 - t) + 30 * t);
      const g = Math.floor(15 * (1 - t) + 10 * t);
      const b = Math.floor(65 * (1 - t) + 77 * t);
      gfx.fillStyle((r << 16) | (g << 8) | b);
      gfx.fillRect(0, y, width, 2);
    }

    // --- Weitfern: dunkle Berge / Silhouetten ---
    gfx.fillStyle(0x1a0f33, 0.5); // dunkelviolett, halbtransparent
    // Berge als ovale Silhouetten
    for (let i = 0; i < 5; i++) {
      const bx = i * 250;
      const bw = 200 + i * 20;
      const bh = 150 + i * 30;
      const by = Math.floor(height * 0.4 + i * 20);
      gfx.fillEllipse(bx + bw / 2, by + bh / 3, bw, bh * 0.6);
    }

    // --- Nebel-Ebene 1 (leicht, weit entfernt) ---
    gfx.fillStyle(0x0a0f2b, 0.15);
    for (let i = 0; i < 20; i++) {
      const nx = (i * 137) % width;
      const ny = Math.floor(((i * 73) % (height / 2)) + height * 0.1);
      const nr = 40 + (i * 13) % 30;
      gfx.fillCircle(nx, ny, nr);
    }

    // --- Lichterquellen in der Weitfern ---
    const lightSources: Array<{ x: number; y: number; r: number; color: number; isCyan: boolean }> = [
      { x: 150, y: 200, r: 60, color: 0x00f0ff, isCyan: true },
      { x: 350, y: 150, r: 45, color: 0xa400ff, isCyan: false },
      { x: 520, y: 280, r: 55, color: 0x00f0ff, isCyan: true },
      { x: 780, y: 180, r: 50, color: 0xa400ff, isCyan: false },
      { x: 900, y: 250, r: 35, color: 0x00f0ff, isCyan: true },
      { x: 200, y: 400, r: 70, color: 0xa400ff, isCyan: false },
      { x: 650, y: 350, r: 50, color: 0x00f0ff, isCyan: true },
      { x: 820, y: 420, r: 45, color: 0xa400ff, isCyan: false },
    ];

    lightSources.forEach(ls => {
      const alpha = ls.isCyan ? 0.2 : 0.18;
      gfx.fillStyle(ls.color, alpha);
      gfx.fillCircle(ls.x, ls.y, ls.r);
      gfx.fillStyle(ls.color, alpha * 0.6);
      gfx.fillCircle(ls.x, ls.y, ls.r * 0.6);
    });

    // --- Nebel-Ebene 2 (vorderer, dichter) ---
    gfx.fillStyle(0x0a0f2b, 0.25);
    for (let i = 0; i < 15; i++) {
      const nx = 100 + (i * 211) % (width - 200);
      const ny = Math.floor(height * 0.5 + (i * 43) % 200);
      const nr = 60 + (i * 17) % 40;
      gfx.fillCircle(nx, ny, nr);
    }

    // --- Untere Nebelschicht ---
    gfx.fillStyle(0x0a0f2b, 0.35);
    gfx.fillRect(0, height * 0.6, width, height * 0.4);

    // --- Leise Lichtstrahlen ---
    gfx.fillStyle(0x00f0ff, 0.4);
    for (let i = 0; i < 30; i++) {
      const sx = (i * 173) % width;
      const sy = (i * 23) % Math.floor(height * 0.5);
      gfx.fillRect(sx, sy, 1, 3);
    }

    gfx.generateTexture('atmospheric_bg', width, height);
    gfx.destroy();
  }

  /**
   * Generiert eine 1280x720 Parallax-Ebene für Berg-Silhouetten.
   * Dunkelviolette Berge, die sich langsam von der Kamera entfernen.
   */
  static generateBgMountains(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const w = 1280;
    const h = 720;

    // Dunkler Hintergrund-Verlauf
    for (let y = 0; y < h; y += 2) {
      const t = y / h;
      const r = Math.floor(5 * (1 - t) + 15 * t);
      const g = Math.floor(8 * (1 - t) + 5 * t);
      const b = Math.floor(40 * (1 - t) + 51 * t);
      gfx.fillStyle((r << 16) | (g << 8) | b);
      gfx.fillRect(0, y, w, 2);
    }

    // Berge-Silhouetten (dunkelviolett)
    gfx.fillStyle(0x1a0f22, 0.4);
    for (let i = 0; i < 7; i++) {
      const bx = i * 200;
      const bw = 250 + i * 20;
      const bh = 180 + i * 30;
      gfx.fillEllipse(bx + bw / 2, h * 0.5, bw, bh);
    }

    // Sterne (klein, weiß)
    gfx.fillStyle(0xffffff, 0.4);
    for (let i = 0; i < 80; i++) {
      const sx = (i * 37) % w;
      const sy = (i * 53) % (h * 0.7);
      gfx.fillRect(sx, sy, 1, 1);
    }

    gfx.generateTexture('bg_mountains', w, h);
    gfx.destroy();
  }

  /**
   * Generiert eine 1280x720 Parallax-Ebene für weite Nebel.
   * Sehr transparent, langsam bewegend.
   */
  static generateBgFogFar(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const w = 1280;
    const h = 720;

    // Transparente Nebel-Kreise
    gfx.fillStyle(0x0a0f2b, 0.35);
    for (let i = 0; i < 25; i++) {
      const nx = (i * 157) % w;
      const ny = Math.floor((i * 73) % (h * 0.8)) + 50;
      const nr = 60 + (i * 13) % 80;
      gfx.fillCircle(nx, ny, nr);
    }

    gfx.generateTexture('bg_fog_far', w, h);
    gfx.destroy();
  }

  /**
   * Generiert eine 1280x720 Parallax-Ebene mit Lichtern.
   * Cyan- und Magenta-Lichter, die pulsieren.
   */
  static generateBgLights(scene: Scene): void {
    const gfx = scene.add.graphics({ x: 0, y: 0 });
    const w = 1280;
    const h = 720;

    // Hintergrund schwarz-transparent
    gfx.fillStyle(0x000000, 0);

    // Lichtquellen
    const lights: Array<{ x: number; y: number; r: number; color: number }> = [
      { x: 180, y: 220, r: 70, color: 0x00f0ff },
      { x: 420, y: 180, r: 55, color: 0xa400ff },
      { x: 650, y: 300, r: 65, color: 0x00f0ff },
      { x: 900, y: 200, r: 50, color: 0xa400ff },
      { x: 1100, y: 280, r: 40, color: 0x00f0ff },
      { x: 250, y: 480, r: 80, color: 0xa400ff },
      { x: 700, y: 420, r: 60, color: 0x00f0ff },
      { x: 950, y: 520, r: 45, color: 0xa400ff },
      { x: 380, y: 120, r: 35, color: 0x00f0ff },
      { x: 750, y: 80, r: 30, color: 0xa400ff },
    ];

    lights.forEach(ls => {
      // Innerer Kern (hell)
      gfx.fillStyle(ls.color, 0.5);
      gfx.fillCircle(ls.x, ls.y, ls.r);
      // Äußerer Flare (dunkler)
      gfx.fillStyle(ls.color, 0.2);
      gfx.fillCircle(ls.x, ls.y, ls.r * 1.8);
    });

    gfx.generateTexture('bg_lights', w, h);
    gfx.destroy();
  }

  /**
   * Generiert eine 1280x720 Nebel-Ebene für Tile-Sprite.
   * Wiederholbar für Scroll-Effekt.
   */
  static generateBgFogNear(scene: Scene): void {
    const w = 1280;
    const h = 720;
    const gfx = scene.add.graphics({ x: 0, y: 0 });

    // Dichte, nahe Nebelschicht
    gfx.fillStyle(0x0a0f2b, 0.5);
    for (let i = 0; i < 20; i++) {
      const nx = 100 + (i * 181) % (w - 200);
      const ny = Math.floor(h * 0.4 + (i * 43) % 200);
      const nr = 80 + (i * 17) % 60;
      gfx.fillCircle(nx, ny, nr);
    }

    gfx.generateTexture('bg_fog_near', w, h);
    gfx.destroy();
  }
}
