/**
 * ParticleSystem – Stub-Verwaltung für Partikel-Effekte.
 *
 * NOTE: Phaser 3.90 hat die klassische ParticleEmitter API entfernt.
 * Diese Klasse ist ein Stub – Partikel-Effekte werden in einer späteren
 * Phaser-Version wieder aktiviert, wenn die API stabil ist.
 * Alle Methoden sind no-ops und sichern Gameplay.
 */

import { Scene } from 'phaser';

export class ParticleSystem {
  constructor(scene: Scene) {
    void scene;
  }

  playDashTrail(x: number, y: number, duration: number = 300): void {
    void x;
    void y;
    void duration;
    // Stub – wird in Phaser-Version mit Partikel-Unterstützung aktiviert
  }

  playHitSpark(x: number, y: number): void {
    void x;
    void y;
    // Stub
  }

  playLandDust(x: number, y: number): void {
    void x;
    void y;
    // Stub
  }

  destroy(): void {
    // Stub
  }
}
