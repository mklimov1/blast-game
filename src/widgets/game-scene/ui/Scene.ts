import { Container } from "pixi.js";

import { gameFieldEventEmitter } from "@/features/game-field/lib/gameFieldEventEmitter";
import Field from "@/widgets/game-field";
import type { Position } from "@/widgets/game-field/model/types";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "./Progress";

export default class Scene {
  public view = new Container();

  private chipField!: Field;

  private score = 0;

  private goal = 500;

  private step = 50;

  private create() {
    const progress = new Progress();
    const gameStats = new GameStats(50);

    this.chipField = new Field(8, 8, 3);
    this.view.addChild(this.chipField, progress, gameStats);
  }

  public init() {
    this.create();
    this.subscribeEvents();

    gameFieldEventEmitter.emit('progress:update', 0, false);
  }

  public destroy() {
    gameFieldEventEmitter.off('blocks:destroyed', this.onBlocksDestroyed);
  }

  private onBlocksDestroyed(positions: Position[]) {
    const newScore = Math.min(this.goal, this.score + positions.length);
    const progress = newScore / this.goal;

    this.score = newScore;
    this.step -= 1;

    gameFieldEventEmitter.emit('progress:update', progress);
    gameFieldEventEmitter.emit('step:update', this.step);
    gameFieldEventEmitter.emit('score:update', newScore);
  }

  private subscribeEvents() {
    gameFieldEventEmitter.on('blocks:destroyed', this.onBlocksDestroyed, this);
  }
}
