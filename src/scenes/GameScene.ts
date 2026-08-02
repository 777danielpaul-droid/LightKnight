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
    // Hintergrund-Farbe
    this.cameras.main.setBackgroundColor('#0a0f2b');

    // Platzhalter-Plattformen (sichtbar als dunkles Violett-Blau, später durch Tilemap ersetzt)
    this.platforms = this.physics.add.staticGroup();

    const createPlatform = (x: number, y: number, w: number, h: number): void => {
      // Nutze sichtbare Rechtecke mit StaticBody für verlässliche Kollision
      const rect = this.add.rectangle(x, y, w, h, 0x2d1a4d, 0.8);
      this.platforms.add(rect);
    };

    // Boden (y=650, Deckel bei y=630)
    createPlatform(640, 650, 1280, 40);
    // Plattform 1
    createPlatform(200, 490, 200, 20);
    // Plattform 2
    createPlatform(600, 390, 200, 20);
    // Plattform 3
    createPlatform(300, 290, 150, 20);

    // Wichtig: StaticGroup-Body neu berechnen
    this.platforms.refresh();
  }

  private setupPlayer(): void {
    this.player = new Player(
      this,
      PlayerConfig.startX,
      PlayerConfig.startY
    );

    // Input-System initialisieren (muss nach Scene.create sein)
    this.player.initInput(this);

    // Kollision mit Plattformen
    this.physics.add.collider(this.player, this.platforms);
  }
}
