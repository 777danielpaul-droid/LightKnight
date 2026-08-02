/**
 * InputSystem – liest Tastatureingaben aus Key-Map und erzeugt Commands.
 * Unterstützt mehrere Tasten pro Aktion (z. B. 'A' und 'ArrowLeft').
 */

import { Scene, Input } from 'phaser';
import { InputConfig } from '../data/input-config';

export type ActionName = keyof typeof InputConfig;

export interface KeyMap {
  [action: string]: string[];
}

export interface PlayerCommand {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  dash: boolean;
  attack: boolean;
}

export class InputSystem {
  private keys: Map<string, boolean> = new Map();
  private keyObjects: Map<string, Input.Keyboard.Key> = new Map();
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.setupKeys();
  }

  private setupKeys(): void {
    const allUniqueKeys = new Set<string>();
    Object.values(InputConfig).forEach((keys) => {
      keys.forEach((k) => allUniqueKeys.add(k));
    });

    allUniqueKeys.forEach((key) => {
      this.keys.set(key, false);
      const keyObj = this.scene.input.keyboard.addKey(key);
      this.keyObjects.set(key, keyObj);
    });
  }

  /**
   * Aktualisiert internen Zustand basierend auf Phaser-Key-Status.
   * Muss pro Frame aufgerufen werden.
   */
  update(): void {
    this.keyObjects.forEach((keyObj, keyName) => {
      this.keys.set(keyName, keyObj.isDown);
    });
  }

  /**
   * Prüft, ob eine Aktion aktuell gehalten wird.
   */
  isActionDown(action: ActionName): boolean {
    const keyList = InputConfig[action];
    return keyList.some((k) => this.keys.get(k) === true);
  }

  /**
   * Prüft, ob eine Aktion gerade frisch gedrückt wurde (Edge-Trigger).
   * Nutzt Phasers JustDown-Funktion für exakte Edge-Erkennung.
   */
  isActionJustPressed(action: ActionName): boolean {
    const keyList = InputConfig[action];
    return keyList.some((k) => {
      const keyObj = this.keyObjects.get(k);
      return keyObj ? Input.Keyboard.JustDown(keyObj) : false;
    });
  }

  /**
   * Generiert Commands für den Player, basierend auf aktueller Eingabe.
   */
  getPlayerCommands(): PlayerCommand {
    return {
      moveLeft: this.isActionDown('moveLeft'),
      moveRight: this.isActionDown('moveRight'),
      jump: this.isActionDown('jump'),
      jumpJustPressed: this.isActionJustPressed('jump'),
      dash: this.isActionJustPressed('dash'),
      attack: this.isActionJustPressed('attack')
    };
  }
}
