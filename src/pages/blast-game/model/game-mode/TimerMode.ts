import { blastGameStore } from '../blastGameStore';
import { Mode, type IGameMode, type TTimerModeInitState } from './types';

export class TimerMode implements IGameMode {
  private type: Mode.TIMER = Mode.TIMER;

  private score = 0;

  private startTime = 0;

  private duration!: number;

  init(initState: TTimerModeInitState) {
    this.score = 0;
    this.startTime = Date.now();
    this.duration = initState.duration;

    setTimeout(() => {
      blastGameStore.emit('finish', { status: 'win', score: this.score });
    }, this.duration);
  }

  update(count: number) {
    this.score += count;
  }

  getProgress() {
    return {
      type: this.type,
      score: this.score,
      startTime: this.startTime,
      currentTime: Date.now() - this.startTime,
      duration: this.duration,
    };
  }
}
