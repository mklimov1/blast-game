import { Container } from "pixi.js";

import { gameFieldEventEmitter } from "@/features/game-field/lib/gameFieldEventEmitter";
import Field from "@/widgets/game-field";
import type { Position } from "@/widgets/game-field/model/types";
import { WinScreen } from "@/widgets/game-over/ui/WinScreen";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "../../game-stats/ui/Progress";
import { sceneEventEmitter } from "../model/sceneEventEmitter";

export default class Scene {
  public view = new Container();

  private chipField!: Field;

  private winScreen!: WinScreen;

  private score = 0;

  private goal = 500;

  private step = 50;

  private create() {
    const progress = new Progress();
    const gameStats = new GameStats(50);

    this.chipField = new Field(8, 8, 3);
    this.winScreen = new WinScreen();

    this.view.addChild(this.chipField, progress, gameStats, this.winScreen);

    this.winScreen.hide(false);
  }

  public init() {
    this.create();
    this.subscribeEvents();

    this.enable();
    sceneEventEmitter.emit('progress:update', 0, false);
  }

  private enable() {
    this.chipField.enable();
  }

  private disable() {
    this.chipField.disable();
  }

  public destroy() {
    gameFieldEventEmitter.off('blocks:destroyed', this.onBlocksDestroyed);
  }

  private onProgress(value: number) {
    if (value >= 1) {
      this.winScreen.show();
      this.disable();
    }
  }

  private onBlocksDestroyed(positions: Position[]) {
    const newScore = Math.min(this.goal, this.score + positions.length);
    const progress = Math.min(newScore / this.goal, 1);

    this.score = newScore;
    this.step -= 1;

    sceneEventEmitter.emit('progress:update', progress);
    sceneEventEmitter.emit('step:update', this.step);
    sceneEventEmitter.emit('score:update', newScore);
  }

  private subscribeEvents() {
    gameFieldEventEmitter.on('blocks:destroyed', this.onBlocksDestroyed, this);
    sceneEventEmitter.on('progress:update', this.onProgress, this);
  }
}
