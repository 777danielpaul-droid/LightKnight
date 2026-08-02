/**
 * Player – HIT, der blau farbene humanoide Tiger.
 * Phaser-Entity mit Arcade-Physik, Bewegung, Dash, Sprung & Animationen.
 */

import { Physics } from 'phaser';
import { PlayerConfig } from '../config/PlayerConfig';
import { createMovementStats, MovementStats } from '../components/MovementStats';
import { InputSystem, PlayerCommand } from '../systems/InputSystem';
import { Scene } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
  private stats: MovementStats;
  private inputSystem: InputSystem;
  private currentHealth: number;

  // Bewegungs-States
  private isDashing: boolean = false;
  private dashTimer: number = 0;
  private dashCooldownTimer: number = 0;
  private facingRight: boolean = true;
  private jumpPressedTime: number = 0;
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  private wasOnFloor: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'player_idle'); // Platzhalter-Textur
    this.stats = createMovementStats();
    this.inputSystem = new InputSystem(scene);
    this.currentHealth = PlayerConfig.maxHealth;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.setupAnimations();
  }

  private setupPhysics(): void {
    const body = this.body as Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setAllowGravity(true);
  }

  private setupAnimations(): void {
    // Animierungen werden in Milestone 2 / 3 mit echten Sprites hinzugefügt
  }

  update(delta: number): void {
    const dt = delta / 1000; // Delta-Zeit in Sekunden
    this.inputSystem.update();
    const commands = this.inputSystem.getPlayerCommands();

    this.handleTimers(dt);
    this.handleMovement(commands, dt);
    this.handleJump(commands, dt);
    this.handleDash(commands, dt);
    this.updateAnimation();
  }

  private handleTimers(dt: number): void {
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }
    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= dt;
    }
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
    }
    if (this.jumpPressedTime > 0) {
      this.jumpPressedTime -= dt;
    }
  }

  private handleMovement(commands: PlayerCommand, dt: number): void {
    const body = this.body as Physics.Arcade.Body;

    // Flip-X für Sprite-Richtung
    if (commands.moveLeft) {
      this.setFlipX(false);
      this.facingRight = false;
    }
    if (commands.moveRight) {
      this.setFlipX(true);
      this.facingRight = true;
    }

    // Dash überschreibt alle anderen Bewegungen
    if (this.isDashing) {
      return;
    }

    const moveInput = (commands.moveRight ? 1 : 0) - (commands.moveLeft ? 1 : 0);

    if (moveInput !== 0) {
      // Beschleunigen mit Delta-Zeit
      const targetVel = moveInput * this.stats.speed;
      const currentVel = body.velocity.x;
      const accelStep = moveInput * this.stats.acceleration * dt;
      const newVel = Phaser.Math.Linear(currentVel, targetVel, 0.2);
      body.setVelocityX(Phaser.Math.Linear(currentVel, targetVel, 0.2));
    } else {
      // Verlangsamen mit Delta-Zeit
      if (body.velocity.x !== 0) {
        const decelStep = Math.sign(body.velocity.x) * this.stats.deceleration * dt;
        const newVel = body.velocity.x - decelStep;
        if (Math.abs(newVel) < Math.abs(decelStep)) {
          body.setVelocityX(0);
        } else {
          body.setVelocityX(newVel);
        }
      }
    }
  }

  private handleJump(commands: PlayerCommand, dt: number): void {
    // Jump Buffering: merken, dass Jump gerade frisch gedrückt wurde
    if (commands.jumpJustPressed) {
      this.jumpBufferTimer = this.stats.jumpBufferTime;
    }

    // On-Ground Check
    const body = this.body as Physics.Arcade.Body;
    const isOnFloor = body.onFloor();
    
    // Coyote-Time: wenn gerade vom Boden gelassen, kurz noch springen können
    if (!this.wasOnFloor && isOnFloor) {
      this.coyoteTimer = this.stats.coyoteTime;
    }
    this.wasOnFloor = isOnFloor;

    // Puffer + Coyote-Time auswerten
    if (this.jumpBufferTimer > 0) {
      const canUseCoyote = !this.isDashing && (isOnFloor || this.coyoteTimer > 0);
      if (canUseCoyote) {
        this.performJump();
        this.jumpBufferTimer = 0;
        this.jumpPressedTime = this.stats.maxJumpHoldTime;
      }
    }

    // Variable Jump Height: wenn Sprung gehalten & noch Zeit, höher halten
    if (commands.jump && this.jumpPressedTime > 0 && body.velocity.y < 0) {
      // Noch höher beschleunigen, solange gehalten
      body.setVelocityY(body.velocity.y + this.stats.jumpVelocity * dt * 30);
    }
  }

  private performJump(): void {
    const body = this.body as Physics.Arcade.Body;
    body.setVelocityY(this.stats.jumpVelocity);
    this.coyoteTimer = 0;
  }

  private handleDash(commands: PlayerCommand, dt: number): void {
    if (this.dashCooldownTimer > 0) return;

    if (commands.dash && !this.isDashing) {
      this.isDashing = true;
      this.dashTimer = this.stats.dashDuration;
      this.dashCooldownTimer = this.stats.dashCooldown;

      const direction = this.facingRight ? 1 : -1;
      const body = this.body as Physics.Arcade.Body;
      body.setVelocityX(direction * this.stats.dashSpeed);
      body.setVelocityY(0); // Dash horizontal
      // Dash-Effekt später hinzufügen
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        // Nach Dash: Geschwindigkeit sanft auf 0 setzen (oder weiterlaufen lassen)
      }
    }
  }

  private updateAnimation(): void {
    // Animationen kommen in Milestone 2
  }

  /**
   * Nimmt Schaden – gibt I-Frames zurück für Unverwundbarkeit.
   */
  takeDamage(amount: number): boolean {
    this.currentHealth -= amount;
    this.currentHealth = Math.max(0, this.currentHealth);
    return this.currentHealth > 0;
  }

  getHealth(): number {
    return this.currentHealth;
  }

  getMaxHealth(): number {
    return PlayerConfig.maxHealth;
  }

  getInputSystem(): InputSystem {
    return this.inputSystem;
  }
}
