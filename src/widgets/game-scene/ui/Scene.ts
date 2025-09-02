import { Container, type Size } from "pixi.js";

import { gameFieldEventEmitter } from "@/features/game-field/lib/gameFieldEventEmitter";
import { appEventEmitter } from "@/shared/lib";
import Field from "@/widgets/game-field";
import type { Position } from "@/widgets/game-field/model/types";
import { GameOverScreen } from "@/widgets/game-over/ui/GameOverScreen";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "../../game-stats/ui/Progress";
import { sceneEventEmitter } from "../model/sceneEventEmitter";

import type { GameUpdatePayload } from "../model/types";

export default class Scene {
  public view = new Container();

  private wrapper!: Container;

  private chipField!: Field;

  private winScreen!: GameOverScreen;

  private loseScreen!: GameOverScreen;

  private score: number = 0;

  private goal: number = 0;

  private step: number = 0;

  private size: Size = { width: 0, height: 0 };

  private create() {
    const progress = new Progress();
    const gameStats = new GameStats(0);

    this.wrapper = new Container();
    this.chipField = new Field(8, 8, 3);
    this.winScreen = new GameOverScreen('YOU WIN!');
    this.loseScreen = new GameOverScreen('YOU LOSE :(');

    this.wrapper.addChild(this.chipField, progress, gameStats, this.winScreen, this.loseScreen);
    this.view.addChild(this.wrapper);
  }

  private initGameSettings() {
    return {
      score: 0,
      goal: 50,
      step: 10,
    };
  }

  public init() {
    this.create();
    this.subscribeEvents();

    this.enable();
    sceneEventEmitter.emit('game:update-progress', this.initGameSettings());
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

  private onProgress(payload: GameUpdatePayload) {
    if (payload.score >= payload.goal) {
      this.disable();
      this.winScreen.show();
      return;
    }
    if (payload.step <= 0) {
      this.disable();
      this.loseScreen.show();
    }
  }

  private onBlocksDestroyed(positions: Position[]) {
    const newScore = Math.min(this.goal, this.score + positions.length);

    this.score = newScore;
    this.step -= 1;

    sceneEventEmitter.emit('game:update-progress', {
      goal: this.goal,
      score: this.score,
      step: this.step,
    });
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
    sceneEventEmitter.on('game:update-progress', this.onProgress, this);
    sceneEventEmitter.on('game:restart', this.restart, this);
  }
}
