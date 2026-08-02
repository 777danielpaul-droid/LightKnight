/**
 * GameScene – Hauptspielszene.
 * Initialisiert den Spieler HIT und eine einfache Tilemap-Plattform-Testszene.
 */

import { Scene } from 'phaser';
import { Player } from '../entities/Player';
import { PlayerConfig } from '../config/PlayerConfig';

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';

  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.setupWorld();
    this.setupPlayer();
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number, delta: number): void {
    this.player.update(delta);
  }

  private setupWorld(): void {
    // Einfaches Hintergrund-Farbe
    this.cameras.main.setBackgroundColor('#0a0f2b');

    // Platzhalter-Plattformen (später durch Tilemap ersetzt)
    this.platforms = this.physics.add.staticGroup();

    // Boden
    this.platforms.create(400, 680, '').setDisplaySize(1280, 40).setOrigin(0.5);
    // Plattform 1
    this.platforms.create(200, 500, '').setDisplaySize(200, 20).setOrigin(0.5);
    // Plattform 2
    this.platforms.create(600, 400, '').setDisplaySize(200, 20).setOrigin(0.5);
    // Plattform 3
    this.platforms.create(300, 300, '').setDisplaySize(150, 20).setOrigin(0.5);
  }

  private setupPlayer(): void {
    this.player = new Player(
      this,
      PlayerConfig.startX,
      PlayerConfig.startY
    );

    // Kollision mit Plattformen
    this.physics.add.collider(this.player, this.platforms);
  }
}
