import { type Size } from 'pixi.js';

import { AssetsLoader } from '@/shared/lib';
import { ParallaxBackground } from '@/shared/ui/ParallaxBackground';
import { GameStats } from '@/widgets/game-stats/ui/GameStats';
import { Progress } from '@/widgets/game-stats/ui/Progress';

import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

export class ClassicBlastGame extends BlastGame {
  private mode = Mode.CLASSIC;

  private gameStats!: GameStats;

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
    this.gameStats = new GameStats(0);
    this.progress = new Progress();
    this.background = new ParallaxBackground(['Ocean_6/1','Ocean_6/2', 'Ocean_6/3', 'Ocean_6/4']);

    this.wrapper.addChildAt(this.background, 0);
    this.wrapper.addChild(this.gameStats, this.progress);
    blastGameStore.emit('update', blastGameStore.getProgress());
  }

  protected resize(size: Size) {
    super.resize(size);
    this.gameStats.resize(size);
    this.progress.resize(size);
    this.background.resize(size);
  }
}
