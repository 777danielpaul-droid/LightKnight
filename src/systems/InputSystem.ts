/**
 * InputSystem – Phaser Keyboard-Tracking.
 *
 * Primäre Eingabequelle sind native window/document Listener
 * (zuverlässig im Headless-Modus). Phaser Key-Objects dienen als
 * Sekundärquelle/Fallback.
 *
 * Edge-Detection (justPressed):
 * - Die native keydown/keyup-Listener aktualisieren keysDown in Echtzeit
 *   und setzen keysJustPressed beim Übergang von false→true.
 * - update() synchronisiert Phaser Key-Status (OR-Logik für Headless).
 * - getPlayerCommands() liest keysJustPressed und resettet danach.
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
  /** Aktueller gehaltener Key-Status (true = gedrückt) */
  private keysDown: Map<string, boolean> = new Map();
  /** Keys, die gerade neu gedrückt wurden (Edge, wird nach Lesen zurückgesetzt) */
  private keysJustPressed: Map<string, boolean> = new Map();

  constructor(scene: Scene) {
    this.setupKeys(scene);
    this.setupNativeFallback(scene);
  }

  private setupKeys(scene: Scene): void {
    const keyboard = scene.input?.keyboard;
    if (!keyboard) return;

    const allUniqueKeys = new Set<string>();
    Object.values(InputConfig).forEach((keys) => {
      keys.forEach((k) => allUniqueKeys.add(k));
    });

    allUniqueKeys.forEach((key) => {
      const code = KEY_TO_CODE[key] || key;
      this.keysDown.set(code, false);
      this.keysJustPressed.set(code, false);
      const keyObj = keyboard.addKey(code);
      this.keyObjects.set(code, keyObj);
    });
  }

  /**
   * Native Keyboard-Fallback: Phaser fängt Keyboard-Events im Headless-Modus
   * nicht immer ab. Wir lauschen auf window + document Level.
   */
  private setupNativeFallback(_scene: Scene): void {
    void _scene;

    const handleKeyDown = (code: string) => {
      if (this.keysDown.has(code)) {
        const wasDown = this.keysDown.get(code) === true;
        this.keysDown.set(code, true);
        // Nur als justPressed markieren, wenn er vorher nicht gedrückt war
        if (!wasDown) {
          this.keysJustPressed.set(code, true);
        }
      }
    };

    const handleKeyUp = (code: string) => {
      if (this.keysDown.has(code)) {
        this.keysDown.set(code, false);
      }
    };

    window.addEventListener('keydown', (e) => {
      handleKeyDown(e.code);
    });
    window.addEventListener('keyup', (e) => {
      handleKeyUp(e.code);
    });

    // Document-Level (Puppeteer sendet dort rein)
    document.addEventListener('keydown', (e) => {
      handleKeyDown(e.code);
    });
    document.addEventListener('keyup', (e) => {
      handleKeyUp(e.code);
    });
  }

  /**
   * Aktualisiert internen Zustand. Muss pro Frame aufgerufen werden.
   * Synchronisiert Phaser Key-Status via OR-Logik (für Headless-Fallback).
   */
  update(): void {
    // Phaser Key-Status synchronisieren (OR mit nativen Events)
    this.keyObjects.forEach((keyObj, code) => {
      const phaserDown = keyObj.isDown;
      const nativeDown = this.keysDown.get(code) === true;
      this.keysDown.set(code, phaserDown || nativeDown);
    });
  }

  isActionDown(action: ActionName): boolean {
    const keyList = InputConfig[action];
    if (!keyList) return false;
    return keyList.some((k) => {
      const code = KEY_TO_CODE[k] || k;
      return this.keysDown.get(code) === true;
    });
  }

  isActionJustPressed(action: ActionName): boolean {
    const keyList = InputConfig[action];
    if (!keyList) return false;
    const result = keyList.some((k) => {
      const code = KEY_TO_CODE[k] || k;
      return this.keysJustPressed.get(code) === true;
    });
    // Reset nach Lesen (einmalige Abfrage pro Frame)
    if (result) {
      keyList.forEach((k) => {
        const code = KEY_TO_CODE[k] || k;
        this.keysJustPressed.set(code, false);
      });
    }
    return result;
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
