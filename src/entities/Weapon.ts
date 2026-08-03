/**
 * Weapon – HIT's Kampfstock.
 * Erstellt Hitbox beim Angriff, verwaltet Cooldown.
 */

import { Physics, Scene } from 'phaser';
import { HitboxConfig } from '../systems/CombatSystem';

export class Weapon extends Physics.Arcade.Sprite {
  private attackCooldown: number = 0;
  private readonly cooldownTime: number = 0.4; // Sekunden

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'weapon');
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setVisible(false); // Unsichtbar, wird nur als Hitbox-Referenz genutzt
  }

  update(delta: number): void {
    const dt = delta / 1000;
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
  }

  canAttack(): boolean {
    return this.attackCooldown <= 0;
  }

  /**
   * Führt einen Nahkampfangriff aus.
   * @returns Hitbox-Konfiguration, die vom CombatSystem verarbeitet wird.
   *   offsetX ist immer positiv (relativ zum Spieler); die Richtung
   *   (links/rechts) wird vom CombatSystem basierend auf flipX berechnet.
   */
  attack(attacker: Physics.Arcade.Sprite): HitboxConfig | null {
    if (!this.canAttack()) return null;

    this.attackCooldown = this.cooldownTime;

    return {
      width: 40,
      height: 30,
      offsetX: 24,  // immer positiv – Richtung wird über flipX bestimmt
      offsetY: 10,
      damage: 1,
      knockbackForce: 150,
      knockbackDirection: attacker.flipX ? -1 : 1
    };
  }
}
