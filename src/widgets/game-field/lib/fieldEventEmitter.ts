import { EventEmitter, type Size } from "pixi.js";

type TEvents = {
  resize: (size: Size) => void
}

export const fieldEventEmitter = new EventEmitter<TEvents>();
