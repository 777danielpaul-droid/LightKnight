/**
 * HealthComponent – Lebensmanagement-Komponente.
 * Wiederverwendbar für Player & Gegner.
 * Einfacher Event-System ohne Node-Abhängigkeit (funktioniert im Browser).
 */

export interface HealthConfig {
  maxHealth: number;
  invincibilityDuration: number; // Sekunden
}

type HealthListener = (current: number, max: number) => void;

export class HealthComponent {
  private _current: number;
  private readonly _max: number;
  private readonly _invincibilityDuration: number;
  private _invincibleUntil: number = 0;
  private listeners: Map<string, HealthListener[]> = new Map();

  constructor(config: HealthConfig) {
    this._max = config.maxHealth;
    this._current = config.maxHealth;
    this._invincibilityDuration = config.invincibilityDuration;
  }

  takeDamage(amount: number, currentTime: number): boolean {
    if (currentTime < this._invincibleUntil) {
      return false; // Noch invulnerabel
    }

    this._current = Math.max(0, this._current - amount);
    this._invincibleUntil = currentTime + this._invincibilityDuration;

    this.emit('damaged', this._current, this._max);

    if (this._current <= 0) {
      this.emit('died');
      return false; // death
    }
    return true; // still alive
  }

  heal(amount: number): void {
    this._current = Math.min(this._max, this._current + amount);
    this.emit('healed', this._current, this._max);
  }

  on(event: string, listener: HealthListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: HealthListener): void {
    const arr = this.listeners.get(event);
    if (arr) {
      this.listeners.set(event, arr.filter(l => l !== listener));
    }
  }

  private emit(event: string, ...args: unknown[]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(l => l(args[0] as number, args[1] as number));
    }
  }

  get current(): number {
    return this._current;
  }

  get max(): number {
    return this._max;
  }

  isAlive(): boolean {
    return this._current > 0;
  }

  isInvincible(currentTime: number): boolean {
    return currentTime < this._invincibleUntil;
  }
}
