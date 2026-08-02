/**
 * InputSystem – liest Tastatureingaben aus Key-Map und erzeugt Commands.
 * Unterstützt mehrere Tasten pro Aktion (z. B. 'A' und 'ArrowLeft').
 */

import { Scene, GameObjects } from 'phaser';
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
  private justPressed: Set<string> = new Set();
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
      const phaserKey = this.scene.input.keyboard.addKey(key);
      this.keys.set(key, false);

      phaserKey.on('down', () => {
        this.keys.set(key, true);
        this.justPressed.add(key);
      });
      phaserKey.on('up', () => {
        this.keys.set(key, false);
      });
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
   */
  isActionJustPressed(action: ActionName): boolean {
    const keyList = InputConfig[action];
    return keyList.some((k) => this.justPressed.has(k));
  }

  /**
   * Muss pro Frame aufgerufen werden, um Just-Pressed-Status zurückzusetzen.
   */
  update(): void {
    this.justPressed.clear();
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
