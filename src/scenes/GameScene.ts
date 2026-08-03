/**
 * GameScene – Haupt-Gameplay-Szene.
 * Nutzt das ECS-Entity-System: Player (mit InputSystem, AnimationSystem, CombatSystem)
 * und Enemy-Entities mit Patrouillen-KI.
 */

import { Scene, Physics } from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { HitboxConfig } from '../systems/CombatSystem';
import { AudioManager } from '../systems/AudioManager';
import { EnemyConfig } from '../data/enemy-config';
import { PlayerConfig } from '../config/PlayerConfig';
import { HealthConfig } from '../components/HealthComponent';
import { ActiveLevel, LevelPlatform, LevelEnemy, LevelCollectible } from '../data/level-config';

export class GameScene extends Scene {
  static readonly KEY = 'GameScene';

  private player!: Player;
  private platforms!: Physics.Arcade.StaticGroup;
  private enemies!: Physics.Arcade.Group;
  private audioManager!: AudioManager;

  constructor() {
    super(GameScene.KEY);
  }

  create(): void {
    this.cameras.main.setBackgroundColor(ActiveLevel.backgroundColor);

    // --- Platform-Gruppe ---
    this.platforms = this.physics.add.staticGroup();
    this.spawnPlatforms(ActiveLevel.platforms);

    // --- Systems ---
    this.audioManager = new AudioManager(this);

    // --- Player (ECS-Entity) ---
    this.player = new Player(this, PlayerConfig.startX, PlayerConfig.startY);
    this.physics.add.collider(this.player, this.platforms);

    // Input muss nach scene.input verfügbar sein (nach BootScene)
    this.player.initInput(this);

    // --- Enemies ---
    this.enemies = this.physics.add.group();
    this.spawnEnemiesFromLevel(ActiveLevel.enemies);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, (playerObj, enemyObj) => {
      const playerSprite = playerObj as Player;
      const enemy = enemyObj as Enemy;
      // Spieler nimmt Schaden wenn er dem Gegner gegenläuft
      playerSprite.takeDamage(enemy.getDamage());
    });

    // --- Collectibles ---
    this.spawnCollectibles(ActiveLevel.collectibles);

    // --- Combat-Detection ---
    this.setupCombat();

    // --- Camera ---
    this.cameras.main.startFollow(this.player, true);

    // Registriere Player beim AudioManager für spatiales Audio
    this.audioManager.registerPlayer(this.player.x, this.player.y);

    // Fokus fürs Keyboard-Input
    this.game.canvas.tabIndex = 1;
    this.game.canvas.focus();

    // Ambient-Loop starten
    this.audioManager.resume();
  }

  private setupCombat(): void {
    // Wenn der Spieler angreift: Hitbox erstellen + Sound abspielen
    this.events.on('playerAttack', (attacker: Player, hitboxConfig: HitboxConfig) => {
      // Erstelle Hitbox an der richtigen Position
      const direction = attacker.flipX ? -1 : 1;
      const hitboxX = attacker.x + hitboxConfig.offsetX * direction;
      const hitboxY = attacker.y + hitboxConfig.offsetY;

      const hitbox = this.add.zone(hitboxX, hitboxY, hitboxConfig.width, hitboxConfig.height);
      this.physics.world.enable(hitbox);
      const body = hitbox.body as Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);
      body.setVelocity(0, 0);

      // Sound abspielen
      this.audioManager.playSFX('sfx_attack', attacker.x, attacker.y);

      // Prüfe Überlappung mit Gegnern — nutze processCallback für genaue Kontrolle
      this.physics.world.overlap(
        hitbox,
        this.enemies,
        (hitboxObj, enemyObj) => {
          void hitboxObj;
          const enemy = enemyObj as Enemy;
          const direction = attacker.flipX ? -1 : 1;
          const wasAlive = enemy.takeDamage(
            hitboxConfig.damage,
            direction,
            hitboxConfig.knockbackForce
          );
          this.audioManager.playSFX('sfx_hit', enemy.x, enemy.y);

          // Hit-Effect an der Trefferposition
          this.events.emit('enemyHit', enemy.x, enemy.y);

          // Nur zerstören, wenn der Gegner wirklich tot ist
          if (!wasAlive) {
            enemy.destroy();
          }
        }
      );

      // Hitbox nach 200ms zerstören
      this.time.delayedCall(200, () => {
        hitbox.destroy();
      });
    });

    // Dash-Sound
    this.events.on('playerDash', (_x: number, _y: number) => {
      void _x;
      void _y;
      this.audioManager.playSFX('sfx_dash');
    });
  }

  private spawnPlatforms(platforms: LevelPlatform[]): void {
    platforms.forEach((p) => {
      const texKey = p.type === 'large' ? 'platform_large' : 'platform_small';
      this.platforms.create(p.x, p.y, texKey);
    });
    this.platforms.refresh();
  }

  private spawnEnemiesFromLevel(enemies: LevelEnemy[]): void {
    enemies.forEach((e) => {
      const typeDefaults = EnemyConfig.types[e.type];
      const config: HealthConfig = {
        maxHealth: typeDefaults.health,
        invincibilityDuration: EnemyConfig.invincibilityDuration
      };
      const enemy = new Enemy(this, e.x, e.y, config, e.type);
      this.enemies.add(enemy);
    });
  }

  private spawnCollectibles(collectibles: LevelCollectible[]): void {
    collectibles.forEach((c) => {
      const texKey = `collectible_${c.type}`;
      const item = this.physics.add
        .sprite(c.x, c.y, texKey)
        .setImmovable(true);
      const body = item.body as Physics.Arcade.Body;
      body.setAllowGravity(false);
      item.setVelocity(0, 0);

      // Leichte Bob-Animation
      this.tweens.add({
        targets: item,
        y: c.y + 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut'
      });

      // Bei Kollision mit Spieler:pickup + Effekte
      this.physics.add.overlap(this.player, item, () => {
        this.events.emit('collectiblePickup', c.type, c.x, c.y);
        this.audioManager.playSFX('sfx_jump');  // kurzer Ping
        item.destroy();
      });
    });
  }

  update(time: number, delta: number): void {
    void time;
    this.player.update(delta);

    // Alle Gegner updaten
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Enemy;
      enemy.update(delta);
    });

    // AudioManager aktualisieren
    this.audioManager.update(this.player.x, this.player.y);
  }
}
