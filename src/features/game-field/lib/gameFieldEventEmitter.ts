import { EventEmitter } from "pixi.js";

import type { Position } from "@/widgets/game-field/model/types";

type GameFieldEvents = {
  "blocks:destroyed": (positions: Position[]) => void;
};

export const gameFieldEventEmitter = new EventEmitter<GameFieldEvents>();
