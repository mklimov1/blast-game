import { blastGameStore } from '../blastGameStore';
import { Mode, type IGameMode, type TTimedModeInitState } from './types';

export class TimedMode implements IGameMode {
  private type: Mode.TIMED = Mode.TIMED;

  private score = 0;

  private startTime = 0;

  private duration!: number;

  init(initState: TTimedModeInitState) {
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
