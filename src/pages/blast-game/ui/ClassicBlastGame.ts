import { GameStats } from '@/widgets/game-stats/ui/GameStats';
import { Progress } from '@/widgets/game-stats/ui/Progress';

import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

import type { Size } from 'pixi.js';

export class ClassicBlastGame extends BlastGame {
  private mode = Mode.CLASSIC;

  private gameStats!: GameStats;

  private progress!: Progress;

  public async init() {
    blastGameStore.init(this.mode, {
      goal: 100,
      step: 20,
      score: 0,
    });
    await super.init();
  }

  protected create() {
    super.create();
    this.gameStats = new GameStats(0);
    this.progress = new Progress();

    this.wrapper.addChild(this.gameStats, this.progress);
    blastGameStore.emit('update', blastGameStore.getProgress());
  }

  protected resize(size: Size) {
    super.resize(size);
    this.gameStats.resize(size);
    this.progress.resize(size);
  }
}
