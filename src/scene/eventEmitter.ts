import { EventEmitter, type Size } from "pixi.js";

type TEvents = {
  resize: (size: Size) => void
}

export default new EventEmitter<TEvents>();
