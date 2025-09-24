import { blastGameStore } from '../blastGameStore';

import type { IGameMode, TDefaultModeInitState } from './types';

export class DefaultMode implements IGameMode {
  private type = 'default' as const;

  private score = 0;

  private goal!: number;

  private step!: number;

  init(initState: TDefaultModeInitState) {
    this.score = 0;
    this.goal = initState.goal;
    this.step = initState.step;
  }

  update(count: number) {
    this.score += count;
    this.step -= 1;

    if (this.score >= this.goal) {
      blastGameStore.emit('finish', { status: 'win', score: this.score });
      return;
    }

    if (this.step <= 0) {
      blastGameStore.emit('finish', { status: 'lose', score: this.score });
      return;
    }
  }

  getProgress() {
    return {
      type: this.type,
      score: this.score,
      step: this.step,
      goal: this.goal,
    };
  }
}
