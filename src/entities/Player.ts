/**
 * Player – HIT, der blau farbige humanoide Tiger.
 * Phaser-Entity mit Arcade-Physik, Bewegung, Dash, Sprung, Animation & Kampf.
 */

import { Physics, Scene } from 'phaser';
import { PlayerConfig } from '../config/PlayerConfig';
import { createMovementStats, MovementStats } from '../components/MovementStats';
import { HealthComponent } from '../components/HealthComponent';
import { InputSystem, PlayerCommand } from '../systems/InputSystem';
import { AnimationSystem } from '../systems/AnimationSystem';
import { Weapon } from './Weapon';

export class Player extends Physics.Arcade.Sprite {
  private stats: MovementStats;
  private inputSystem?: InputSystem;
  private health: HealthComponent;
  private animationSystem: AnimationSystem;
  private weapon?: Weapon;

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
    super(scene, x, y, 'idle_0'); // Platzhalter-Frame
    this.stats = createMovementStats();
    this.health = new HealthComponent({
      maxHealth: PlayerConfig.maxHealth,
      invincibilityDuration: PlayerConfig.invincibilityDuration
    });
    this.animationSystem = new AnimationSystem(scene);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.setupAnimations();
  }

  /**
   * Muss nach Scene.create() aufgerufen werden, da Input-System abhängig
   * von scene.input ist, das erst nach Boot verfügbar ist.
   */
  initInput(scene: Scene): void {
    this.inputSystem = new InputSystem(scene);
    this.weapon = new Weapon(scene, this.x, this.y);
  }

  private setupPhysics(): void {
    const body = this.body as Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setImmovable(false);
    body.setCollideWorldBounds(true);
    body.setVelocity(0, 0);
    body.setBounce(0);
  }

  private setupAnimations(): void {
    this.play('player_idle_anim', true);
  }

  update(delta: number): void {
    if (!this.inputSystem) return;

    this.inputSystem.update();
    const commands = this.inputSystem.getPlayerCommands();

    const dt = delta / 1000;

    this.handleTimers(dt);
    this.handleMovement(commands, dt);
    this.handleJump(commands, dt);
    this.handleDash(commands, dt);
    this.handleAttack(commands);
    this.updateAnimation();

    // Weapon-Update
    if (this.weapon) {
      this.weapon.update(delta);
      this.weapon.x = this.x;
      this.weapon.y = this.y;
    }
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

    // Flip-X für Sprite-Richtung (Phaser flipX = true zeigt nach LINKS)
    if (commands.moveLeft) {
      this.setFlipX(true);
      this.facingRight = false;
    }
    if (commands.moveRight) {
      this.setFlipX(false);
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
    void dt;
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

    // Direkter Sprung, wenn auf dem Boden oder Coyote-Time aktiv
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
    void dt;
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }

    // Dash startet nur auf Edge (frisch gedrückt)
    if (commands.dashJustPressed && !this.isDashing && this.dashCooldownTimer <= 0) {
      this.isDashing = true;
      this.dashTimer = this.stats.dashDuration;
      this.dashCooldownTimer = this.stats.dashCooldown;

      const direction = this.facingRight ? 1 : -1;
      const body = this.body as Physics.Arcade.Body;
      body.setVelocityX(direction * this.stats.dashSpeed);
      body.setVelocityY(0);

      // Dash Screen-Shake
      this.scene.cameras.main.shake(100, 0.008);
      this.scene.events.emit('playerDash', this.x, this.y);
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    // Während Dash gehalten: weiter in die Richtung bewegen
    if (commands.dash && this.isDashing) {
      const direction = this.facingRight ? 1 : -1;
      const body = this.body as Physics.Arcade.Body;
      body.setVelocityX(direction * this.stats.dashSpeed);
    }
  }

  private updateAnimation(): void {
    const body = this.body as Physics.Arcade.Body;

    if (this.isDashing) {
      this.animationSystem.play(this, 'dash');
    } else if (!body.onFloor()) {
      if (body.velocity.y < 0) {
        this.animationSystem.play(this, 'jump');
      } else {
        this.animationSystem.play(this, 'fall');
      }
    } else {
      const moveInput = (this.inputSystem?.isActionDown('moveRight') ? 1 : 0) - (this.inputSystem?.isActionDown('moveLeft') ? 1 : 0);
      if (moveInput !== 0) {
        this.animationSystem.play(this, 'run');
      } else {
        this.animationSystem.play(this, 'idle');
      }
    }
  }

  private handleAttack(commands: PlayerCommand): void {
    if (!this.weapon || !commands.attack) return;
    const hitboxConfig = this.weapon.attack(this);
    if (hitboxConfig) {
      this.scene.events.emit('playerAttack', this, hitboxConfig);
    }
  }

  takeDamage(amount: number): boolean {
    const alive = this.health.takeDamage(amount, Date.now() / 1000);
    // Hit-Flash: Bordeaux-Rot Tint
    if (alive) {
      this.setTint(0x7b1e2b);
      this.scene.tweens.add({
        targets: this,
        alpha: 0.3,
        duration: 80,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.clearTint();
          this.alpha = 1;
        }
      });
    }
    return alive;
  }

  isAlive(): boolean {
    return this.health.isAlive();
  }

  getHealth(): number {
    return this.health.current;
  }

  getMaxHealth(): number {
    return PlayerConfig.maxHealth;
  }

  getInputSystem(): InputSystem | undefined {
    return this.inputSystem;
  }

  getWeapon(): Weapon | undefined {
    return this.weapon;
  }
}
