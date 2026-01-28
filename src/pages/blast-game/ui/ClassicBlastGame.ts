import { type Size } from 'pixi.js';

import {
  AssetsLoader,
  GameStatistics,
  generateLevelConfig,
  LevelLoader,
  levelStore,
  Mode,
  ParallaxBackground,
  Progress,
  type Breakpoint,
} from '@/shared';

import { BlastGame } from './BlastGame';
import { ClassicMode } from '../model/game-mode/ClassicMode';

import type { TClassicModeProgress } from '../model/game-mode/types';

export class ClassicBlastGame extends BlastGame<Mode.CLASSIC> {
  private gameStatistics!: GameStatistics;

  private progress!: Progress;

  private background!: ParallaxBackground;

  private async loadLevel() {
    const currentLevel = levelStore.get();

    try {
      this.currentLevelConfig = await LevelLoader.load(currentLevel);
    } catch {
      this.currentLevelConfig = generateLevelConfig(currentLevel);
    }
  }

  protected async load(): Promise<void> {
    await super.load();
    await this.loadLevel();
    await AssetsLoader.load('OCEAN_6');
  }

  protected async create() {
    this.mode = new ClassicMode({
      goal: this.currentLevelConfig.goal,
      step: this.currentLevelConfig.steps,
      score: 0,
    });
    this.mode.update(0);

    super.create();

    this.gameStatistics = new GameStatistics(0);
    this.progress = new Progress();
    this.background = new ParallaxBackground(['Ocean_6-1', 'Ocean_6-2', 'Ocean_6-3', 'Ocean_6-4']);

    this.wrapper.addChildAt(this.background, 0);
    this.wrapper.addChild(this.gameStatistics, this.progress);
  }

  protected resize(size: Size, breakpoint: Breakpoint) {
    super.resize(size, breakpoint);
    this.gameStatistics.resize(size, breakpoint);
    this.progress.resize(size);
    this.background.resize(size);
  }

  private updateStatistics(payload: TClassicModeProgress) {
    this.progress.setProgress(payload);
    this.gameStatistics.updateStatistics(payload);
  }

  protected async win() {
    levelStore.next();
    super.win();
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
