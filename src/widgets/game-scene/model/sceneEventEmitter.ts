import { EventEmitter } from "pixi.js";

type SceneEvents = {
  "progress:update": (value: number, animated?: boolean) => void;
  "step:update": (value: number) => void;
  "score:update": (value: number) => void;
};

export const sceneEventEmitter = new EventEmitter<SceneEvents>();
