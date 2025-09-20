import { Container, type Size } from 'pixi.js';

import { fieldStore } from '@/features/game-field/model/FieldStore';
import { appEventEmitter, AssetsLoader } from '@/shared/lib';
import { show } from '@/shared/lib/animations';
import { Scene } from '@/shared/scene/Scene';
import { sceneManager } from '@/shared/scene/SceneManager';
import Field from '@/widgets/game-field';
import type { Position } from '@/widgets/game-field/model/types';
import { GameStats } from '@/widgets/game-stats/ui/GameStats';
import { Progress } from '@/widgets/game-stats/ui/Progress';

import { blastGameStore } from '../model/blastGameStore';

export default class BlastGame extends Scene {
  public view = new Container();

  private wrapper!: Container;

  private gameStats!: GameStats;

  private progress!: Progress;

  private chipField!: Field;

  protected create() {
    this.wrapper = new Container();
    this.chipField = new Field();
    this.gameStats = new GameStats(0);
    this.progress = new Progress();

    this.wrapper.addChild(
      this.chipField,
      this.progress,
      this.gameStats,
    );
    this.view.addChild(this.wrapper);
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
    await AssetsLoader.load('PROGRESS-BAR');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('UI');
  }

  public async init() {
    await super.init();
    this.enable();

    blastGameStore.init({
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
    blastGameStore.addScore(positions.length);
  }

  protected finishScene(isWin: boolean) {
    super.finishScene();
    this.disable();
    sceneManager.changeScene(isWin ? 'gameWin' : 'gameLose');
  }

  protected show() {
    show(this.view);
  }

  protected unsubscribeEvents() {
    fieldStore.removeAllListeners();
    blastGameStore.removeAllListeners();
    appEventEmitter.off('resize', this.resize, this);
  }

  private resize(size: Size) {
    this.chipField.resize(size);
    this.gameStats.resize(size);
    this.progress.resize(size);
  }

  private win() {
    this.finishScene(true);
  }

  private lose() {
    this.finishScene(false);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    fieldStore.on('blocks:destroyed', this.onBlocksDestroyed, this);
    fieldStore.on('blocks:destroyed', this.disable, this);
    fieldStore.on('blocks:added', this.enable, this);
    blastGameStore.on('win', this.win, this);
    blastGameStore.on('lose', this.lose, this);
  }
}
