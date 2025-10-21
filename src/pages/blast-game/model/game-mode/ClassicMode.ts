import EventEmitter from 'eventemitter3';

import { Mode, type EventTypes, type IGameMode, type TClassicModeProgress } from './types';

export type TClassicModeConfig = {
  goal: number;
  step: number;
  score: number;
}

type ModeEventTypes = EventTypes & {
  update: (progress: TClassicModeProgress) => void
}

export class ClassicMode extends EventEmitter<ModeEventTypes> implements IGameMode<Mode.CLASSIC> {
  private type: Mode.CLASSIC = Mode.CLASSIC;

  private score = 0;

  private goal!: number;

  private step!: number;

  constructor({ goal, step }: TClassicModeConfig) {
    super();

    this.score = 0;
    this.goal = goal;
    this.step = step;
  }

  update(count: number) {
    this.score += count;
    this.step -= 1;
    this.emit('update', this.getProgress());

    if (this.score >= this.goal) {
      this.emit('finish', { status: 'win', score: this.score });
      return;
    }

    if (this.step <= 0) {
      this.emit('finish', { status: 'lose', score: this.score });
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
