import { EventEmitter } from "pixi.js";

import type { GameState } from "./types";

export type BlastGameEvents = {
  "update": (payload: GameState) => void;
  "win": () => void;
  "lose": () => void;
};

class BlastGameStore extends EventEmitter<BlastGameEvents> {
  private score: number = 0;

  private goal: number = 0;

  private step: number = 0;

  private initState!: GameState;

  init(initState: GameState) {
    this.initState = initState;
    this.score = initState.score;
    this.goal = initState.goal;
    this.step = initState.step;

    this.emit("update", {
      score: this.score,
      goal: this.goal,
      step: this.step,
    });
  }

  addScore(points: number) {
    this.score = Math.min(this.goal, this.score + points);
    this.step -= 1;

    this.emit("update", {
      score: this.score,
      goal: this.goal,
      step: this.step,
    });

    if (this.score >= this.goal) {
      this.emit("win");
      return;
    }

    if (this.step <= 0) {
      this.emit('lose');
    }
  }

  restart() {
    this.init(this.initState);
  }

  lose() {
    this.emit("lose");
  }

  getState() {
    return { score: this.score, goal: this.goal, step: this.step };
  }
}

export const blastGameStore = new BlastGameStore();
