/**
 * Enemy-Konfiguration – zentrale Werte für alle Gegner-Typen.
 */

export const EnemyConfig = {
  // Grundwerte (können pro Gegnertyp überschrieben werden)
  speed: 50,
  patrolRange: 120,
  health: 2,
  damage: 1,
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
