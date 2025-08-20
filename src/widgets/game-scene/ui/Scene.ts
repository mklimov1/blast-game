import { Container, type Size } from "pixi.js";

import { gameFieldEventEmitter } from "@/features/game-field/lib/gameFieldEventEmitter";
import { appEventEmitter } from "@/shared/lib";
import Field from "@/widgets/game-field";
import type { Position } from "@/widgets/game-field/model/types";
import { GameOverScreen } from "@/widgets/game-over/ui/GameOverScreen";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "../../game-stats/ui/Progress";
import { sceneEventEmitter } from "../model/sceneEventEmitter";

export default class Scene {
  public view = new Container();

  private wrapper!: Container;

  private chipField!: Field;

  private winScreen!: GameOverScreen;

  private loseScreen!: GameOverScreen;

  private score!: number;

  private goal!: number;

  private step!: number;

  private size: Size = { width: 0, height: 0 };

  private create() {
    const progress = new Progress();
    const gameStats = new GameStats(50);

    this.score = 0;
    this.goal = 50;
    this.step = 5;

    this.wrapper = new Container();
    this.chipField = new Field(8, 8, 3);
    this.winScreen = new GameOverScreen('YOU WIN!');
    this.loseScreen = new GameOverScreen('YOU LOSE :(');

    this.wrapper.addChild(this.chipField, progress, gameStats, this.winScreen, this.loseScreen);
    this.view.addChild(this.wrapper);
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

  private onProgress(progress: number) {
    if (progress >= 1) {
      this.winScreen.show();
      this.disable();
      return;
    }
    if (this.step <= 0) {
      this.loseScreen.show();
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

  private restart() {
    this.disable();
    this.unsubscribeEvents();
    this.wrapper.destroy({
      children: true,
      texture: false,
      textureSource: false,
      context: true,
      style: true,
    });
    this.init();
    sceneEventEmitter.emit('scene:resize', this.size);
  }

  private unsubscribeEvents() {
    gameFieldEventEmitter.removeAllListeners();
    sceneEventEmitter.removeAllListeners();
  }

  private resize(size: Size) {
    this.size = size;
    sceneEventEmitter.emit('scene:resize', size);
  }

  private subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    gameFieldEventEmitter.on('blocks:destroyed', this.onBlocksDestroyed, this);
    sceneEventEmitter.on('progress:update', this.onProgress, this);
    sceneEventEmitter.on('game:restart', this.restart, this);
  }
}
