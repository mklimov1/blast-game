import { Timer } from '@/shared/ui/Timer';

import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

import type { Size } from 'pixi.js';

export class TimerBlastGame extends BlastGame {
  private mode = Mode.TIMER;

  private timer!: Timer;

  protected intervalId!: NodeJS.Timeout;

  public async init() {
    blastGameStore.init(this.mode, {
      duration: 30000,
    });
    await super.init();
  }

  protected create(): void {
    super.create();
    this.timer = new Timer();
    this.wrapper.addChild(this.timer);
    this.updateTimer();
  }

  protected resize(size: Size): void {
    super.resize(size);
    this.timer.resize(size);
  }

  private stopTimer() {
    clearInterval(this.intervalId);
  }

  private updateTimer() {
    const progress = blastGameStore.getProgress();
    if (progress.type !== Mode.TIMER) return;
    const msLeft = progress.endTime - progress.currentTime;
    this.timer.setTime(msLeft);
  }

  protected unsubscribeEvents(): void {
    super.unsubscribeEvents();
    blastGameStore.off('finish', this.stopTimer, this);
    clearInterval(this.intervalId);
  }

  protected subscribeEvents(): void {
    super.subscribeEvents();
    blastGameStore.on('finish', this.stopTimer, this);
    this.intervalId = setInterval(() => this.updateTimer(), 200);
  }
}
