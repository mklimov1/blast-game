import { type Size } from 'pixi.js';

import { AssetsLoader, GameStatistics, ParallaxBackground, Progress } from '@/shared';

import { BlastGame } from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

export class ClassicBlastGame extends BlastGame {
  private mode = Mode.CLASSIC;

  private gameStatistics!: GameStatistics;

  private progress!: Progress;

  private background!: ParallaxBackground;

  public async init() {
    blastGameStore.init(this.mode, {
      goal: 100,
      step: 20,
      score: 0,
    });
    await super.init();
  }

  protected async load(): Promise<void> {
    await super.load();
    await AssetsLoader.load('OCEAN_6');
  }

  protected create() {
    super.create();
    this.gameStatistics = new GameStatistics(0);
    this.progress = new Progress();
    this.background = new ParallaxBackground(['Ocean_6-1','Ocean_6-2', 'Ocean_6-3', 'Ocean_6-4']);

    this.wrapper.addChildAt(this.background, 0);
    this.wrapper.addChild(this.gameStatistics, this.progress);
    this.updateStatistics();
  }

  protected resize(size: Size) {
    super.resize(size);
    this.gameStatistics.resize(size);
    this.progress.resize(size);
    this.background.resize(size);
  }

  private updateStatistics() {
    const progress = blastGameStore.getProgress();

    this.progress.setProgress(progress);
    this.gameStatistics.updateStatistics(progress);
  }

  protected unsubscribeEvents(): void {
    super.unsubscribeEvents();
    blastGameStore.off('update', this.updateStatistics, this);
  }

  protected subscribeEvents(): void {
    super.subscribeEvents();
    blastGameStore.on('update', this.updateStatistics, this);
  }
}
