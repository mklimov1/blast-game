import { EventEmitter, type Size } from 'pixi.js';

type TEvents = {
  resize: (size: Size) => void;
}

export const appEventEmitter = new EventEmitter<TEvents>();
