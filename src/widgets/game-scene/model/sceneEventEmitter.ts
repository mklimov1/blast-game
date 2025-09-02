import { EventEmitter, type Size } from "pixi.js";

import type { GameUpdatePayload } from "./types";
type SceneEvents = {
  "game:restart": () => void;
  "scene:resize": (size: Size) => void;
  "game:update-progress": (payload: GameUpdatePayload) => void;
};

export const sceneEventEmitter = new EventEmitter<SceneEvents>();
