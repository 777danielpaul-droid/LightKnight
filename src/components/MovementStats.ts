/**
 * MovementStats – Komponente, die alle bewegungsrelevanten Werte des Spielers hält.
 * Wird vom Player-Entity verwendet, Werte stammen aus PlayerConfig.
 */

export interface MovementStats {
  speed: number;
  acceleration: number;
  deceleration: number;
  jumpVelocity: number;
  jumpHoldMultiplier: number;
  maxJumpHoldTime: number;
  coyoteTime: number;
  jumpBufferTime: number;
  dashSpeed: number;
  dashDuration: number;
  dashCooldown: number;
  dashInputWindow: number;
}

import { PlayerConfig } from '../config/PlayerConfig';

export const createMovementStats = (): MovementStats => ({
  speed: PlayerConfig.speed,
  acceleration: PlayerConfig.acceleration,
  deceleration: PlayerConfig.deceleration,
  jumpVelocity: PlayerConfig.jumpVelocity,
  jumpHoldMultiplier: PlayerConfig.jumpHoldMultiplier,
  maxJumpHoldTime: PlayerConfig.maxJumpHoldTime,
  coyoteTime: PlayerConfig.coyoteTime,
  jumpBufferTime: PlayerConfig.jumpBufferTime,
  dashSpeed: PlayerConfig.dashSpeed,
  dashDuration: PlayerConfig.dashDuration,
  dashCooldown: PlayerConfig.dashCooldown,
  dashInputWindow: PlayerConfig.dashInputWindow
});
