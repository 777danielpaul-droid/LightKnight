import { Types } from 'phaser';
import { BootScene } from '../scenes/BootScene';

/**
 * Zentrale Spiel-Konfiguration.
 * Alle wichtigen Werte sind hier konfigurierbar, nicht hardcoded.
 */

export const GameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#0a0f2b',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 512 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene]
};
