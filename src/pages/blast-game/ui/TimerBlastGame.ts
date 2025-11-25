import { type TTimerModeProgress } from '@/pages';
import { AssetsLoader, Mode, ParallaxBackground, Score, Timer, type Breakpoint } from '@/shared';

import { BlastGame } from './BlastGame';
import { TimerMode } from '../model/game-mode/TimerMode';

import type { Size } from 'pixi.js';

export class TimerBlastGame extends BlastGame<Mode.TIMER> {
  private timer!: Timer;

  private score!: Score;

  private background!: ParallaxBackground;

  protected intervalId!: NodeJS.Timeout;

  public async init() {
    this.mode = new TimerMode({
      duration: 30000,
    });
    await super.init();
    this.mode.update(0);
  }

  protected async load(): Promise<void> {
    await super.load();
    await AssetsLoader.load('CITY3');
  }

  protected create(): void {
    super.create();
    this.timer = new Timer();
    this.score = new Score();
    this.background = new ParallaxBackground([
      'city3-1',
      'city3-2',
      'city3-3',
      'city3-4',
      'city3-5',
    ]);

    this.wrapper.addChildAt(this.background, 0);
    this.wrapper.addChild(this.timer, this.score);

    const progress = this.mode.getProgress();
    this.updateTimer(progress);
    this.updateScore(progress);
  }

  protected resize(size: Size, breakpoint: Breakpoint): void {
    super.resize(size, breakpoint);
    this.timer.resize(size);
    this.score.resize(size, breakpoint);
    this.background.resize(size);
  }

  private stopTimer() {
    clearInterval(this.intervalId);
  }

  private updateScore(payload: TTimerModeProgress) {
    this.score.updateScore(payload.score);
  }

  private updateTimer(payload: TTimerModeProgress) {
    const msLeft = payload.endTime - payload.currentTime;
    this.timer.setTime(msLeft);
  }

  protected unsubscribeEvents(): void {
    super.unsubscribeEvents();
    this.mode.off('finish', this.stopTimer, this);
    this.mode.off('update', this.updateScore, this);
    clearInterval(this.intervalId);
  }

  protected subscribeEvents(): void {
    super.subscribeEvents();
    this.mode.on('finish', this.stopTimer, this);
    this.mode.on('update', this.updateScore, this);
    this.intervalId = setInterval(() => this.updateTimer(this.mode.getProgress()), 200);
  }
}
