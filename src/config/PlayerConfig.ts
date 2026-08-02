/**
 * PlayerConfig – zentrale Konfigurationswerte für HIT (den Helden).
 * Alle Werte sind hier konfigurierbar, nicht hardcoded im Entity-Code.
 */

export const PlayerConfig = {
  // Bewegung
  speed: 220,            // Grundlaufgeschwindigkeit (px/s)
  acceleration: 1200,    // Beschleunigung beim Starten
  deceleration: 2400,    // Verzögerung beim Anhalten
  maxSpeedMultiplier: 1.0,

  // Sprungphysik
  jumpVelocity: -520,    // Negativ = nach oben
  jumpHoldMultiplier: 0.5,  // Wie stark gehaltenen Sprung verlängert (0.5 = halbe Kontrolle)
  maxJumpHoldTime: 0.15, // Wie lange man halten kann, um höher zu springen (Sekunden)
  coyoteTime: 0.1,       // Zeitraum nach Plattformsprung, in dem noch gesprungen werden kann
  jumpBufferTime: 0.1,   // Zeitraum, in dem ein Sprung-Befehl "gepuffert" wird

  // Dash
  dashSpeed: 720,         // Geschwindigkeit während des Dashes
  dashDuration: 0.12,     // Dauer des Dash (Sekunden)
  dashCooldown: 0.35,     // Cooldown zwischen Dashes (Sekunden)
  dashInputWindow: 0.15,  // Wie lange ein Doppel-Tap als Dash erkannt wird

  // Leben
  maxHealth: 5,
  invincibilityDuration: 1.2, // Sekunden von Unverwundbarkeit nach Schaden

  // Größe / Position
  width: 32,
  height: 48,
  startX: 200,
  startY: 600
};
