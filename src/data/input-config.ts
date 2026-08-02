/**
 * Eingabekonfiguration – zentrale Key-Bindings.
 * Wird vom InputSystem gelesen, um Commands zu erzeugen.
 */

import { KeyMap } from '../systems/InputSystem';

export const InputConfig: KeyMap = {
  moveLeft: ['A', 'ArrowLeft'],
  moveRight: ['D', 'ArrowRight'],
  jump: ['W', 'Space', 'ArrowUp'],
  dash: ['ShiftLeft', 'ShiftRight'],
  attack: ['J', 'X']
};
