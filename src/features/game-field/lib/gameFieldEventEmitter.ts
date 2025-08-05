import { EventEmitter } from "pixi.js";

import type { Position } from "@/widgets/game-field/model/types";

type GameFieldEvents = {
  "blocks:destroyed": (positions: Position[]) => void;
  "score:update": (score: number) => void;
  "combo:finished": () => void;
  "progress:update": (value: number, animated?: boolean) => void;
};

export const gameFieldEventEmitter = new EventEmitter<GameFieldEvents>();
