import { type Size } from 'pixi.js';

import { AssetsLoader, GameStatistics, ParallaxBackground, Progress } from '@/shared';

import { BlastGame } from './BlastGame';
import { ClassicMode } from '../model/game-mode/ClassicMode';

import type { Mode, TClassicModeProgress } from '../model/game-mode/types';

export class ClassicBlastGame extends BlastGame<Mode.CLASSIC> {
  private gameStatistics!: GameStatistics;

  private progress!: Progress;

  private background!: ParallaxBackground;

  public async init() {
    this.mode = new ClassicMode({
      goal: 100,
      step: 20,
      score: 0,
    });
    await super.init();
    this.mode.update(0);
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
  }

  protected resize(size: Size) {
    super.resize(size);
    this.gameStatistics.resize(size);
    this.progress.resize(size);
    this.background.resize(size);
  }

  private updateStatistics(payload: TClassicModeProgress) {
    this.progress.setProgress(payload);
    this.gameStatistics.updateStatistics(payload);
  }

  protected unsubscribeEvents(): void {
    super.unsubscribeEvents();
    this.mode.off('update', this.updateStatistics, this);
  }

  protected subscribeEvents(): void {
    super.subscribeEvents();
    this.mode.on('update', this.updateStatistics, this);
  }
}
