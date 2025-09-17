import { Container, type Size } from "pixi.js";

import { fieldStore } from "@/features/game-field/model/FieldStore";
import { appEventEmitter } from "@/shared/lib";
import Field from "@/widgets/game-field";
import type { Position } from "@/widgets/game-field/model/types";
import { GameOverScreen } from "@/widgets/game-over/ui/GameOverScreen";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "../../game-stats/ui/Progress";
import { gameSceneStore } from "../model/gameSceneStore";

export default class Scene {
  public view = new Container();

  private wrapper!: Container;

  private gameStats!: GameStats;

  private progress!: Progress;

  private chipField!: Field;

  private winScreen!: GameOverScreen;

  private loseScreen!: GameOverScreen;

  private size: Size = { width: 0, height: 0 };

  private create() {
    this.wrapper = new Container();
    this.chipField = new Field();
    this.winScreen = new GameOverScreen('YOU WIN!');
    this.loseScreen = new GameOverScreen('YOU LOSE :(');
    this.gameStats = new GameStats(0);
    this.progress = new Progress();

    this.wrapper.addChild(
      this.chipField,
      this.progress,
      this.gameStats,
      this.winScreen,
      this.loseScreen,
    );
    this.view.addChild(this.wrapper);
  }

  public init() {
    this.create();
    this.subscribeEvents();
    this.enable();

    gameSceneStore.init({
      goal: 100,
      step: 20,
      score: 0,
    });

    fieldStore.init(8, 8, 3);
    const blocks = fieldStore.fill();

    this.chipField.setup();
    this.chipField.fill(...blocks);
  }

  private enable() {
    this.chipField.enable();
  }

  private disable() {
    this.chipField.disable();
  }

  public destroy() {
    fieldStore.off('blocks:destroyed', this.onBlocksDestroyed);
  }

  private onBlocksDestroyed(...positions: Position[]) {
    gameSceneStore.addScore(positions.length);
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
    this.resize(this.size);
  }

  private unsubscribeEvents() {
    fieldStore.removeAllListeners();
    gameSceneStore.removeAllListeners();
  }

  private resize(size: Size) {
    this.size = size;

    this.chipField.resize(size);
    this.winScreen.resize(size);
    this.loseScreen.resize(size);
    this.gameStats.resize(size);
    this.progress.resize(size);
  }

  private win() {
    this.disable();
    this.winScreen.show();
  }

  private lose() {
    this.disable();
    this.loseScreen.show();
  }

  private subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    fieldStore.on('blocks:destroyed', this.onBlocksDestroyed, this);
    gameSceneStore.on('win', this.win, this);
    gameSceneStore.on('lose', this.lose, this);
    gameSceneStore.on('restart', this.restart, this);
  }
}
