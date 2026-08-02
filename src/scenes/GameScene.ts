import { Scene, Physics } from 'phaser';

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';
  private player!: Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private jKey!: Phaser.Input.Keyboard.Key;
  private platforms!: Physics.Arcade.StaticGroup;

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0f2b');

    // Platform-Gruppe (nutzt Textur-Keys von BootScene)
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(640, 680, 'platform_large');   // Boden
    this.platforms.create(200, 500, 'platform_small');  // Plattform 1
    this.platforms.create(600, 400, 'platform_small');  // Plattform 2
    this.platforms.refresh();

    // Player
    this.player = this.physics.add.sprite(200, 590, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

    // Focus Canvas for input
    this.game.canvas.tabIndex = 1;
    this.game.canvas.focus();

    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    if (!this.player.body) return;
    const body = this.player.body as Physics.Arcade.Body;

    // Movement (A/D / Pfeiltasten)
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(false);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(200);
      this.player.setFlipX(true);
    } else if (body.onFloor()) {
      this.player.setVelocityX(0);
    }

    // Jump (Space)
    if (this.spaceKey.isDown && body.onFloor()) {
      this.player.setVelocityY(-400);
    }

    // Dash (Shift) – placeholder
    if (this.shiftKey.isDown) { /* Dash später */ }
    // Attack (J) – placeholder
    if (this.jKey.isDown) { /* Attack später */ }
  }
}
