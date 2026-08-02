/**
 * InputSystem – Phaser Keyboard-Tracking.
 * Nutzt scene.input.keyboard für native Phaser-Key-Events.
 */

import { Scene, Input } from 'phaser';
import { InputConfig } from '../data/input-config';

export type ActionName = keyof typeof InputConfig;

export interface PlayerCommand {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  dash: boolean;
  dashJustPressed: boolean;
  attack: boolean;
}

/** KeyMap für Eingabekonfiguration (kompatibel mit input-config.ts) */
export interface KeyMap {
  [action: string]: string[];
}

/** Keyboard-Code → Action-Name Mapping */
const KEY_TO_CODE: Record<string, string> = {
  'A': 'KeyA',
  'ArrowLeft': 'ArrowLeft',
  'D': 'KeyD',
  'ArrowRight': 'ArrowRight',
  'W': 'KeyW',
  'Space': 'Space',
  'ArrowUp': 'ArrowUp',
  'ShiftLeft': 'ShiftLeft',
  'ShiftRight': 'ShiftRight',
  'J': 'KeyJ',
  'X': 'KeyX'
};

export class InputSystem {
  private keyObjects: Map<string, Input.Keyboard.Key> = new Map();
  private keysDown: Map<string, boolean> = new Map();
  private prevKeysDown: Map<string, boolean> = new Map();

  constructor(scene: Scene) {
    this.setupKeys(scene);
    this.setupNativeFallback(scene);
  }

  private setupKeys(scene: Scene): void {
    const allUniqueKeys = new Set<string>();
    Object.values(InputConfig).forEach((keys) => {
      keys.forEach((k) => allUniqueKeys.add(k));
    });

    allUniqueKeys.forEach((key) => {
      const code = KEY_TO_CODE[key] || key;
      this.keysDown.set(code, false);
      this.prevKeysDown.set(code, false);
      const keyObj = scene.input.keyboard.addKey(code);
      this.keyObjects.set(code, keyObj);
    });
  }

  /**
   * Native Keyboard-Fallback: Phaser fängt Keyboard-Events im Headless-Modus
   * nicht immer ab. Wir lauschen auf window + document Level.
   */
  private setupNativeFallback(_scene: Scene): void {
    const handle = (code: string, isDown: boolean) => {
      if (this.keysDown.has(code)) {
        this.keysDown.set(code, isDown);
      }
    };

    window.addEventListener('keydown', (e) => {
      handle(e.code, true);
    });
    window.addEventListener('keyup', (e) => {
      handle(e.code, false);
    });

    // Document-Level (Puppeteer sendet dort rein)
    document.addEventListener('keydown', (e) => {
      handle(e.code, true);
    });
    document.addEventListener('keyup', (e) => {
      handle(e.code, false);
    });
  }

  /**
   * Aktualisiert internen Zustand basierend auf Phaser-Key-Status.
   * Muss pro Frame aufgerufen werden.
   */
  update(): void {
    // Swap: prev = old current
    const oldKeys = new Map(this.keysDown);

    // Phaser Key-Status (überschreibt nur, wenn Phaser aktiv ist)
    let phaserUpdated = false;
    this.keyObjects.forEach((keyObj, code) => {
      if (keyObj.isDown) {
        this.keysDown.set(code, true);
        phaserUpdated = true;
      }
    });

    // Falls Phaser nichts aktualisiert hat → native Events sind Autorität
    // (im Headless-Modus fängt Phaser nichts ab)
    if (!phaserUpdated) {
      // keysDown bleibt von native Listeners aktualisiert
    }

    this.prevKeysDown = oldKeys;
  }

  isActionDown(action: ActionName): boolean {
    const keyList = InputConfig[action];
    return keyList.some((k) => {
      const code = KEY_TO_CODE[k] || k;
      return this.keysDown.get(code) === true;
    });
  }

  isActionJustPressed(action: ActionName): boolean {
    const keyList = InputConfig[action];
    return keyList.some((k) => {
      const code = KEY_TO_CODE[k] || k;
      const curr = this.keysDown.get(code);
      const prev = this.prevKeysDown.get(code);
      return curr === true && prev !== true;
    });
  }

  getPlayerCommands(): PlayerCommand {
    return {
      moveLeft: this.isActionDown('moveLeft'),
      moveRight: this.isActionDown('moveRight'),
      jump: this.isActionDown('jump'),
      jumpJustPressed: this.isActionJustPressed('jump'),
      dash: this.isActionDown('dash'),
      dashJustPressed: this.isActionJustPressed('dash'),
      attack: this.isActionJustPressed('attack')
    };
  }
}
