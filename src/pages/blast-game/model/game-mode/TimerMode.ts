import EventEmitter from 'eventemitter3';

import { Mode } from '@/shared';

import { type EventTypes, type IGameMode, type TTimerModeProgress } from './types';

export type TTimerModeConfig = {
  duration: number;
};

type ModeEventTypes = EventTypes & {
  update: (progress: TTimerModeProgress) => void;
};

export class TimerMode extends EventEmitter<ModeEventTypes> implements IGameMode<Mode.TIMER> {
  public readonly type: Mode.TIMER = Mode.TIMER;

  private score = 0;

  private startTime = 0;

  private endTime = 0;

  private duration!: number;

  constructor({ duration }: TTimerModeConfig) {
    super();

    this.score = 0;
    this.startTime = Date.now();
    this.duration = duration;
    this.endTime = this.startTime + this.duration;

    setTimeout(() => {
      this.emit('finish', { status: 'win', score: this.score });
    }, this.duration);
  }

  update(count: number) {
    this.score += count;
    this.emit('update', this.getProgress());
  }

  getProgress() {
    const currentTime = Date.now();
    const leftTime = Math.max(this.endTime - currentTime, 0);
    return {
      currentTime,
      leftTime,
      type: this.type,
      score: this.score,
      startTime: this.startTime,
      duration: this.duration,
      endTime: this.endTime,
    };
  }
}
