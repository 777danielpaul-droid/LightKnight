/**
 * CombatSystem – verwaltet Hitbox/Hurtbox-Kollisionen, Knockback & Trefferfeedback.
 *
 * Hitbox = was der Spieler/Gegner *macht* (Angriff)
 * Hurtbox = was der Spieler/Gegner *bekommt* (Schaden)
 */

import { Physics, Scene } from 'phaser';
import { HealthComponent } from '../components/HealthComponent';

export interface Combatant {
  body: Physics.Arcade.Body;
  health: HealthComponent;
  takeKnockback: (direction: number, force: number) => void;
  scene: Scene;
}

export interface HitboxConfig {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  damage: number;
  knockbackForce: number;
  knockbackDirection: number; // -1 = links, 1 = rechts
}

export class CombatSystem {
  private scene: Scene;
  private hitboxes: Physics.Arcade.Group;

  constructor(scene: Scene) {
    this.scene = scene;
    this.hitboxes = scene.physics.add.group();
  }

  /**
   * Erstellt eine temporäre Hitbox an der Position des Angreffers.
   */
  createHitbox(
    attacker: Physics.Arcade.Sprite,
    config: HitboxConfig
  ): Physics.Arcade.Body {
    const direction = attacker.flipX ? -1 : 1;

    const hitbox = this.scene.add.zone(
      attacker.x + config.offsetX * direction,
      attacker.y + config.offsetY,
      config.width,
      config.height
    );

    this.scene.physics.world.enable(hitbox);

    const body = hitbox.body as Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setVelocity(0, 0);

    // Auto-Destroy nach kurzer Zeit
    this.scene.time.delayedCall(200, () => {
      hitbox.destroy();
    });

    return body;
  }

  /**
   * Prüft Kollision zwischen Hitbox und Hurtbox.
   * Wird als Callback an .overlap() übergeben.
   */
  static checkHit(
    hitboxBody: Physics.Arcade.Body,
    targetBody: Physics.Arcade.Body,
    targetHealth: HealthComponent,
    target: Combatant,
    damage: number,
    knockbackDirection: number,
    knockbackForce: number,
    currentTime: number
  ): boolean {
    if (!targetHealth.takeDamage(damage, currentTime)) {
      return false; // death - already handled by emit
    }

    target.takeKnockback(knockbackDirection, knockbackForce);
    return true; // hit registered
  }

  /**
   * Registriert eine Attack-Collision zwischen Hitbox-Group und Ziel-Gruppe.
   */
  setupAttackCollision(
    attackerGroup: Physics.Arcade.Group,
    targetGroup: Physics.Arcade.Group,
    config: HitboxConfig
  ): void {
    this.scene.physics.add.overlap(
      attackerGroup,
      targetGroup,
      (hitboxObj, targetObj) => {
        const hitboxBody = hitboxObj as Physics.Arcade.Body;
        const targetBody = (targetObj as Physics.Arcade.Sprite).body as Physics.Arcade.Body;
        const targetSprite = targetObj as Physics.Arcade.Sprite;
        // Hier würde HealthComponent-Logik laufen – in Enemy implementieren
      },
      undefined,
      this
    );
  }
}
