/**
 * HoloKnight – Main Entry Point
 * 2D Canvas Game
 */

import { Game } from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 600 }, debug: false }
  },
  scene: [BootScene, GameScene],
  callbacks: {
    postBoot: (game: Phaser.Game) => {
      game.canvas.tabIndex = 1;
      game.canvas.focus();
    }
  }
};

new Game(config);
