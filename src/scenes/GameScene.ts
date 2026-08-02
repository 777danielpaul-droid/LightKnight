/**
 * GameScene – Hauptspielszene.
 * Initialisiert Player HIT, Gegner, Kampf, Sound & Partikel-System.
 */

import { Scene, Physics, GameObjects } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { PlayerConfig } from '../config/PlayerConfig';
import { CombatSystem, HitboxConfig } from '../systems/CombatSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { AudioManager } from '../systems/AudioManager';

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';

  private player!: Player;
  private platforms!: Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private combatSystem!: CombatSystem;
  private particleSystem?: ParticleSystem;
  private hitboxes!: Physics.Arcade.Group;
  private levelExit?: GameObjects.Zone;
  private audioManager!: AudioManager;

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.setupWorld();
    this.setupPlayer();
    this.setupParticles();
    this.setupEnemies();
    this.setupCombat();
    this.setupLevelExit();
    this.setupSound();
    this.setupAmbientLight();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number, delta: number): void {
    this.player.update(delta);
    this.enemies.forEach(enemy => enemy.update(delta));

    // Audio-Position updaten
    this.audioManager.registerPlayer(this.player.x, this.player.y);

    // Hitbox-Position updaten
    this.hitboxes.getChildren().forEach((child) => {
      const sprite = child as Physics.Arcade.Sprite;
      if (sprite.body) {
        const b = sprite.body as Physics.Arcade.Body;
        sprite.x += b.velocity.x * (delta / 1000);
      }
    });
  }

  private setupWorld(): void {
    this.cameras.main.setBackgroundColor('#0a0f2b');

    this.platforms = this.physics.add.staticGroup();

    const createPlatform = (x: number, y: number, w: number, h: number): void => {
      const rect = this.add.rectangle(x, y, w, h, 0x2d1a4d, 0.8);
      this.platforms.add(rect);
    };

    createPlatform(640, 650, 1280, 40);   // Boden
    createPlatform(200, 490, 200, 20);    // Plattform 1
    createPlatform(600, 390, 200, 20);    // Plattform 2
    createPlatform(300, 290, 150, 20);    // Plattform 3 (Ende)

    this.platforms.refresh();
  }

  private setupPlayer(): void {
    this.player = new Player(this, PlayerConfig.startX, PlayerConfig.startY);
    this.player.initInput(this);
    this.physics.add.collider(this.player, this.platforms);

    this.events.on('playerAttack', (attacker: Player, config: HitboxConfig) => {
      this.createPlayerHitbox(attacker, config);
    });
  }

  private createPlayerHitbox(attacker: Player, config: HitboxConfig): void {
    const direction = attacker.flipX ? -1 : 1;
    const hitbox = this.add.zone(
      attacker.x + config.offsetX * direction,
      attacker.y + config.offsetY,
      config.width,
      config.height
    );

    this.physics.world.enable(hitbox);
    const body = hitbox.body as Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocityX(config.knockbackDirection * 50);
    this.hitboxes.add(hitbox);

    this.time.delayedCall(150, () => {
      if (hitbox.scene) hitbox.destroy();
    });
  }

  private setupEnemies(): void {
    const enemy1 = new Enemy(this, 150, 440, { maxHealth: 2, invincibilityDuration: 0.5 });
    this.physics.add.collider(enemy1, this.platforms);
    this.enemies.push(enemy1);

    const enemy2 = new Enemy(this, 550, 340, { maxHealth: 2, invincibilityDuration: 0.5 });
    this.physics.add.collider(enemy2, this.platforms);
    this.enemies.push(enemy2);
  }

  private setupCombat(): void {
    this.combatSystem = new CombatSystem(this);
    this.hitboxes = this.physics.add.group();

    this.physics.add.overlap(this.hitboxes, this.enemies, (hitboxObj, enemyObj) => {
      const hitboxSprite = hitboxObj as Physics.Arcade.Sprite;
      const enemy = enemyObj as Enemy;

      if (enemy.isAlive()) {
        enemy.takeDamage(1, hitboxSprite.body.velocity.x > 0 ? 1 : -1, 150);
        if (this.particleSystem) this.particleSystem.playHitSpark(enemy.x, enemy.y);
        this.audioManager.playSFX('sfx_hit', enemy.x, enemy.y);
        if (!enemy.isAlive()) enemy.destroy();
        hitboxSprite.destroy();
      }
    });
  }

  private setupParticles(): void {
    this.particleSystem = new ParticleSystem(this);
  }

  private setupLevelExit(): void {
    this.levelExit = this.add.zone(375, 275, 30, 10);
    this.physics.world.enable(this.levelExit);
    (this.levelExit.body as Physics.Arcade.Body).setAllowGravity(false);
    (this.levelExit.body as Physics.Arcade.Body).setImmovable(true);

    // Exit-Zeichen (Bordeaux)
    this.add.rectangle(375, 275, 30, 10, 0x7b1e2b, 0.6);

    this.physics.add.overlap(this.player, this.levelExit, () => {
      this.handleLevelComplete();
    });
  }

  private setupSound(): void {
    this.audioManager = new AudioManager(this);

    // Browser Autoplay-Policy: Erst nach User-Interaction Sound freigeben
    const resumeAudio = () => {
      this.audioManager.resume();
      this.input.once('pointerdown', resumeAudio);
      this.input.keyboard.once('keydown', resumeAudio);
    };
    this.input.once('pointerdown', resumeAudio);
    this.input.keyboard.once('keydown', resumeAudio);
  }

  private setupAmbientLight(): void {
    // Ambient-Licht: Hellen Halo um Spieler (#00f0ff Cyan, dunkelblau Hintergrund)
    // Nutzt einen großen, halbtransparenten Kreis als Light-Overlay
    const light = this.add.circle(0, 0, 400, 0x00f0ff, 0.12);
    light.setDepth(-1);
    this.cameras.main.setBounds(-100, -100, 2000, 1200);
    // Hintergrund-Dunkelheit für Kontrast
    const darkness = this.add.rectangle(800, 400, 2000, 1200, 0x000000, 0.7);
    darkness.setDepth(-2);
    // Spieler-Licht folgt
    this.cameras.main.on('cameramove', () => {
      light.x = this.player.x;
      light.y = this.player.y;
    });
  }

  private handleLevelComplete(): void {
    this.cameras.main.shake(300, 0.01);
    this.cameras.main.zoomTo(1.2, 300);
    this.scene.start('GameScene');
  }
}
