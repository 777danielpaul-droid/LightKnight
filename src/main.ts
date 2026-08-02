/**
 * LightKnight - Main Entry Point
 * 2D Metroidvania / Action Adventure
 */

import { Game } from 'phaser';
import { GameConfig } from './config/GameConfig';

const gameContainer = document.getElementById('game-container');
if (!gameContainer) {
  throw new Error('#game-container nicht gefunden.');
}

new Game({
  ...GameConfig,
  parent: gameContainer
});
