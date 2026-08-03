/**
 * Enemy-Konfiguration – zentrale Werte für alle Gegner-Typen.
 */

export type EnemyType = 'shadow_wolf' | 'crystal_guardian';

export const EnemyConfig = {
  // Standard-Werte (können pro Gegnertyp überschrieben werden)
  speed: 50,
  patrolRange: 120,
  health: 2,
  damage: 1,
  invincibilityDuration: 0.5,
  knockbackResistance: 0.8,

  // Gegner-Typen
  types: {
    shadow_wolf: {
      speed: 80,
      patrolRange: 150,
      health: 2,
      damage: 1
    },
    crystal_guardian: {
      speed: 30,
      patrolRange: 80,
      health: 4,
      damage: 2
    }
  }
};
