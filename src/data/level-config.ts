/**
 * Level-Konfiguration – deklarative Level-Daten für LightKnight.
 * Enthält Platzierungen von Plattformen, Gegnern, Collectibles und Checkpoints.
 * Wird von BootScene/GameScene geladen, um die Welt zu initialisieren.
 */

export interface LevelPlatform {
  x: number;
  y: number;
  type: 'large' | 'small';
}

export interface LevelEnemy {
  x: number;
  y: number;
  type: 'shadow_wolf' | 'crystal_guardian';
}

export type CollectibleType = 'health' | 'mana' | 'speed_boost';

export interface LevelCollectible {
  x: number;
  y: number;
  type: CollectibleType;
}

export interface LevelCheckpoint {
  x: number;
  y: number;
  id: string;
}

export interface ParallaxLayerConfig {
  key: string;
  scrollFactor: number;
  tile?: boolean;
  alpha?: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  platforms: LevelPlatform[];
  enemies: LevelEnemy[];
  collectibles: LevelCollectible[];
  checkpoints: LevelCheckpoint[];
  backgroundLayers: ParallaxLayerConfig[];
}

/**
 * Level 1: "Awakening Chamber"
 * Einführungslevel — HIT erwacht in einer unteren Kammer, muss Steigfliegel hinaufklettern.
 * Fokus: Grundbewegung, erste Gegner, erste Abilitys.
 */
export const Level1: LevelConfig = {
  id: 'level_1',
  name: 'Awakening Chamber',
  width: 2000,
  height: 1000,
  backgroundColor: '#0a0f2b',
  backgroundLayers: [
    { key: 'bg_mountains', scrollFactor: 0.05, alpha: 1 },
    { key: 'bg_fog_far', scrollFactor: 0.15, alpha: 0.4 },
    { key: 'bg_lights', scrollFactor: 0.30, alpha: 0.7 },
    { key: 'bg_fog_near', scrollFactor: 0.50, tile: true, alpha: 0.3 },
  ],

  platforms: [
    // Boden
    { x: 640, y: 680, type: 'large' },
    // Plattformen in der unteren Kammer (nähe Spieler-Start)
    { x: 200, y: 500, type: 'small' },
    { x: 600, y: 400, type: 'small' },
    { x: 1000, y: 500, type: 'small' },
    { x: 350, y: 300, type: 'small' },
    { x: 750, y: 300, type: 'small' },
    // Steigfliegel nach oben
    { x: 1200, y: 400, type: 'small' },
    { x: 1400, y: 300, type: 'small' },
    { x: 1100, y: 200, type: 'small' },
    // Oberfläche / Ausgangsbereich
    { x: 1600, y: 500, type: 'large' },
    { x: 1800, y: 300, type: 'small' },
  ],

  enemies: [
    // Shadow Wolves in der unteren Kammer
    { x: 280, y: 570, type: 'shadow_wolf' },
    { x: 580, y: 570, type: 'shadow_wolf' },
    // Auf dem ersten Plattform-Level
    { x: 180, y: 470, type: 'shadow_wolf' },
    { x: 620, y: 370, type: 'shadow_wolf' },
    // Geschwindigkeits-Check: schneller Wolf am Steigfliegel
    { x: 1180, y: 370, type: 'shadow_wolf' },
    // Kristall-Wache als Mini-Boss am Ausgang
    { x: 1750, y: 470, type: 'crystal_guardian' },
  ],

  collectibles: [
    // Gesundheit in der unteren Kammer (nahe Boden)
    { x: 200, y: 570, type: 'health' },
    { x: 600, y: 570, type: 'health' },
    // Geschwindigkeits-Boost am Plattform-Level
    { x: 350, y: 470, type: 'speed_boost' },
    { x: 750, y: 370, type: 'speed_boost' },
    // Mana oben auf den Plattformen
    { x: 1000, y: 470, type: 'mana' },
    // Mana am unteren Niveau
    { x: 280, y: 370, type: 'mana' },
  ],

  checkpoints: [
    { x: 600, y: 370, id: 'checkpoint_1' }, // Nach erster Gegenwart
    { x: 1600, y: 470, id: 'checkpoint_2' }, // Nach Steigfliegel
  ],
};

/**
 * Level 2: "Forgotten Catacombs"
 * Vertikaler Level — enge Gänge, viele Gegner, erste Dash-Übertritte.
 */
export const Level2: LevelConfig = {
  id: 'level_2',
  name: 'Forgotten Catacombs',
  width: 1600,
  height: 1400,
  backgroundColor: '#0a0f2b',
  backgroundLayers: [
    { key: 'bg_mountains', scrollFactor: 0.05, alpha: 1 },
    { key: 'bg_fog_far', scrollFactor: 0.15, alpha: 0.4 },
    { key: 'bg_lights', scrollFactor: 0.30, alpha: 0.7 },
    { key: 'bg_fog_near', scrollFactor: 0.50, tile: true, alpha: 0.3 },
  ],

  platforms: [
    { x: 320, y: 680, type: 'large' },
    { x: 150, y: 500, type: 'small' },
    { x: 480, y: 500, type: 'small' },
    { x: 320, y: 350, type: 'small' },
    { x: 150, y: 200, type: 'small' },
    { x: 480, y: 200, type: 'small' },
    { x: 320, y: 50, type: 'small' },
    { x: 600, y: 600, type: 'large' },
    { x: 800, y: 400, type: 'small' },
    { x: 1000, y: 250, type: 'small' },
    { x: 800, y: 100, type: 'small' },
    { x: 1200, y: 500, type: 'large' },
    { x: 1400, y: 300, type: 'small' },
  ],

  enemies: [
    { x: 120, y: 570, type: 'shadow_wolf' },
    { x: 450, y: 570, type: 'shadow_wolf' },
    { x: 300, y: 340, type: 'shadow_wolf' },
    { x: 140, y: 190, type: 'shadow_wolf' },
    { x: 460, y: 190, type: 'shadow_wolf' },
    { x: 300, y: 40, type: 'shadow_wolf' },
    { x: 780, y: 570, type: 'shadow_wolf' },
    { x: 780, y: 390, type: 'shadow_wolf' },
    { x: 980, y: 240, type: 'shadow_wolf' },
    { x: 780, y: 90, type: 'shadow_wolf' },
    { x: 1380, y: 470, type: 'shadow_wolf' },
    { x: 1180, y: 290, type: 'shadow_wolf' },
    { x: 1380, y: 270, type: 'shadow_wolf' },
    // Crystal Guardian als Boss
    { x: 1200, y: 470, type: 'crystal_guardian' },
  ],

  collectibles: [
    { x: 150, y: 460, type: 'health' },
    { x: 480, y: 360, type: 'health' },
    { x: 150, y: 160, type: 'health' },
    { x: 600, y: 560, type: 'health' },
    { x: 800, y: 360, type: 'speed_boost' },
    { x: 800, y: 60, type: 'speed_boost' },
    { x: 1200, y: 460, type: 'health' },
    { x: 1400, y: 260, type: 'mana' },
  ],

  checkpoints: [
    { x: 600, y: 570, id: 'checkpoint_1' },
    { x: 1200, y: 470, id: 'checkpoint_2' },
    { x: 800, y: 100, id: 'checkpoint_3' },
  ],
};

/**
 * Zentraler Export aller Levels für progressive Freischaltung.
 */
export const Levels: Record<string, LevelConfig> = {
  level_1: Level1,
  level_2: Level2,
};

/**
 * Aktives Level — hier auswählen für Tests.
 */
export const ActiveLevel: LevelConfig = Level1;
