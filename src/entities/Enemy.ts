/**
 * Enemy – einfacher Gegner mit Grund-KI.
 * Bewegt sich zwischen zwei Punkten, nimt Schaden von Spieler-Angriffen.
 */

import { Physics } from 'phaser';
import { HealthComponent, HealthConfig } from '../components/HealthComponent';
import { EnemyConfig, EnemyType } from '../data/enemy-config';

export class Enemy extends Physics.Arcade.Sprite {
  private health: HealthComponent;
  private patrolSpeed: number;
  private patrolLeft: number;
  private patrolRight: number;
  private knockbackVelocity: number = 0;
  private enemyType: EnemyType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: HealthConfig,
    type?: EnemyType
  ) {
    super(scene, x, y, 'enemy');
    this.enemyType = type ?? 'shadow_wolf';
    this.health = new HealthComponent(config);

    const typeDefaults = EnemyConfig.types[this.enemyType];
    this.patrolSpeed = typeDefaults.speed;
    this.patrolLeft = x - typeDefaults.patrolRange / 2;
    this.patrolRight = x + typeDefaults.patrolRange / 2;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
  }

  private setupPhysics(): void {
    const body = this.body as Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setAllowGravity(true);
    body.setSize(24, 24);
    body.setOffset(0, 0);
    body.setVelocityX(this.patrolSpeed);
  }

  update(delta: number): void {
    void delta;
    const body = this.body as Physics.Arcade.Body;

    // Knockback anwenden
    if (this.knockbackVelocity !== 0) {
      body.setVelocityX(this.knockbackVelocity);
      this.knockbackVelocity *= 0.9; // abklingen
      if (Math.abs(this.knockbackVelocity) < 10) {
        this.knockbackVelocity = 0;
      }
    } else {
      // Patrouillieren
      if (this.x <= this.patrolLeft) {
        body.setVelocityX(this.patrolSpeed);
        this.setFlipX(false);
      } else if (this.x >= this.patrolRight) {
        body.setVelocityX(-this.patrolSpeed);
        this.setFlipX(true);
      }
    }
  }

  takeDamage(amount: number, knockbackDirection: number, knockbackForce: number): boolean {
    const alive = this.health.takeDamage(amount, Date.now() / 1000);
    if (alive) {
      this.takeKnockback(knockbackDirection, knockbackForce);
    }
    return alive;
  }

  takeKnockback(direction: number, force: number): void {
    this.knockbackVelocity = direction * force;
  }

  isAlive(): boolean {
    return this.health.isAlive();
  }

  getDamage(): number {
    return EnemyConfig.types[this.enemyType].damage;
  }
}
