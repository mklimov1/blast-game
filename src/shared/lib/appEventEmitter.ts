import EventEmitter from 'eventemitter3';
import { type Size } from 'pixi.js';
type TEvents = {
  resize: (size: Size) => void;
}

export const appEventEmitter = new EventEmitter<TEvents>();
