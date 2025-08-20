import { EventEmitter, type Size } from "pixi.js";

type SceneEvents = {
  "progress:update": (value: number, animated?: boolean) => void;
  "step:update": (value: number) => void;
  "score:update": (value: number) => void;
  "game:restart": () => void;
  "scene:resize": (size: Size) => void;
};

export const sceneEventEmitter = new EventEmitter<SceneEvents>();
