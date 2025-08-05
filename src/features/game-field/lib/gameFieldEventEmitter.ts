import { EventEmitter } from "pixi.js";

import type { Position } from "@/widgets/game-field/model/types";

type GameFieldEvents = {
  "blocks:destroyed": (positions: Position[]) => void;
  "progress:update": (value: number, animated?: boolean) => void;
  "step:update": (value: number) => void;
  "score:update": (value: number) => void;
};

export const gameFieldEventEmitter = new EventEmitter<GameFieldEvents>();
