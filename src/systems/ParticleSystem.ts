/**
 * ParticleSystem – Stub-Verwaltung für Partikel-Effekte.
 *
 * NOTE: Phaser 3.90 hat die klassische ParticleEmitter API entfernt.
 * Diese Klasse ist ein Stub – Partikel-Effekte werden in einer späteren
 * Phaser-Version wieder aktiviert, wenn die API stabil ist.
 * Alle Methoden sind no-ops (Function-Stub) und sichern Gameplay.
 */

import { Scene } from 'phaser';

export class ParticleSystem {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  playDashTrail(x: number, y: number, duration: number = 300): void {
    // Stub – wird in Phaser-Version mit Partikel-Unterstützung aktiviert
  }

  playHitSpark(x: number, y: number): void {
    // Stub
  }

  playLandDust(x: number, y: number): void {
    // Stub
  }

  destroy(): void {
    // Stub
  }
}
