/**
 * Enemy – einfacher Gegner mit Grund-KI.
 * Bewegt sich zwischen zwei Punkten, nimmt Schaden von Spieler-Angriffen.
 */

import { Physics } from 'phaser';
import { HealthComponent, HealthConfig } from '../components/HealthComponent';
import { EnemyConfig } from '../data/enemy-config';

export class Enemy extends Physics.Arcade.Sprite {
  private health: HealthComponent;
  private patrolSpeed: number;
  private patrolLeft: number;
  private patrolRight: number;
  private direction: number = 1;
  private knockbackVelocity: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: HealthConfig
  ) {
    super(scene, x, y, 'enemy');
    this.health = new HealthComponent(config);
    this.patrolSpeed = EnemyConfig.speed;
    this.patrolLeft = x - EnemyConfig.patrolRange / 2;
    this.patrolRight = x + EnemyConfig.patrolRange / 2;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.setupAnimations();
  }

  private setupPhysics(): void {
    const body = this.body as Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setAllowGravity(true);
    body.setSize(24, 24);
    body.setOffset(0, 0);
    body.setVelocityX(this.patrolSpeed);
  }

  private setupAnimations(): void {
    // Platzhalter-Animation
  }

  update(delta: number): void {
    const dt = delta / 1000;
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
        this.direction = 1;
        body.setVelocityX(this.patrolSpeed);
        this.setFlipX(false);
      } else if (this.x >= this.patrolRight) {
        this.direction = -1;
        body.setVelocityX(-this.patrolSpeed);
        this.setFlipX(true);
      }
    }
  }

  takeDamage(amount: number, knockbackDirection: number, knockbackForce: number): boolean {
    return this.health.takeDamage(amount, Date.now() / 1000);
  }

  takeKnockback(direction: number, force: number): void {
    this.knockbackVelocity = direction * force;
  }

  isAlive(): boolean {
    return this.health.isAlive();
  }
}
