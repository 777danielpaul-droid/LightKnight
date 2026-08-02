/**
 * GameScene – Hauptspielszene.
 * Initialisiert den Spieler HIT, Gegner, Kampf-System und Plattformen.
 */

import { Scene, Physics } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { PlayerConfig } from '../config/PlayerConfig';
import { CombatSystem, HitboxConfig } from '../systems/CombatSystem';
import { PlaceholderAssetGenerator } from '../systems/AssetGenerator';

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';

  private player!: Player;
  private platforms! : Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private combatSystem!: CombatSystem;
  private hitboxes!: Physics.Arcade.Group;

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.setupWorld();
    this.setupPlayer();
    this.setupEnemies();
    this.setupCombat();
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time: number, delta: number): void {
    this.player.update(delta);
    this.enemies.forEach(enemy => enemy.update(delta));
    this.hitboxes.getChildren().forEach((child) => {
      const sprite = child as Physics.Arcade.Sprite;
      if (sprite.body) {
        const b = sprite.body as Physics.Arcade.Body;
        sprite.x += b.velocity.x * (delta / 1000);
      }
    });
  }

  private setupWorld(): void {
    // Hintergrund-Farbe
    this.cameras.main.setBackgroundColor('#0a0f2b');

    // Platzhalter-Plattformen (sichtbar als dunkles Violett-Blau, später durch Tilemap ersetzt)
    this.platforms = this.physics.add.staticGroup();

    const createPlatform = (x: number, y: number, w: number, h: number): void => {
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

    // Player attack-Event lauschen
    this.events.on('playerAttack', (attacker: Player, config: HitboxConfig) => {
      this.createPlayerHitbox(attacker, config);
    });
  }

  private setupEnemies(): void {
    // Gegner auf Plattform 1
    const enemy1 = new Enemy(this, 150, 440, {
      maxHealth: 2,
      invincibilityDuration: 0.5
    });
    this.physics.add.collider(enemy1, this.platforms);
    this.enemies.push(enemy1);

    // Gegner auf Plattform 2
    const enemy2 = new Enemy(this, 550, 340, {
      maxHealth: 2,
      invincibilityDuration: 0.5
    });
    this.physics.add.collider(enemy2, this.platforms);
    this.enemies.push(enemy2);
  }

  private setupCombat(): void {
    this.combatSystem = new CombatSystem(this);
    this.hitboxes = this.physics.add.group();

    // Hitbox-Body überlappt mit Enemy-Hitboxen
    this.physics.add.overlap(
      this.hitboxes,
      this.enemies,
      (hitboxObj, enemyObj) => {
        const hitboxBody = hitboxObj as Physics.Arcade.Body;
        const enemy = enemyObj as Enemy;

        if (enemy.isAlive()) {
          enemy.takeDamage(1, hitboxBody.velocity.x > 0 ? 1 : -1, 150);

          // Hit-Effect spawnen
          PlaceholderAssetGenerator.generateHitEffectTexture(this);

          // Hitbox nach Treffer entfernen
          const hitboxSprite = hitboxObj as Physics.Arcade.Sprite;
          hitboxSprite.destroy();
        }
      }
    );
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

    // Auto-Destroy nach kurzer Zeit
    this.time.delayedCall(150, () => {
      if (hitbox.scene) {
        hitbox.destroy();
      }
    });
  }
}
