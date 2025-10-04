import { blastGameStore, Mode } from '@/pages';
import { AssetsLoader, ParallaxBackground, Timer } from '@/shared';
import { Score } from '@/widgets';

import { BlastGame } from './BlastGame';

import type { Size } from 'pixi.js';

export class TimerBlastGame extends BlastGame {
  private mode = Mode.TIMER;

  private timer!: Timer;

  private score!: Score;

  private background!: ParallaxBackground;

  protected intervalId!: NodeJS.Timeout;

  public async init() {
    blastGameStore.init(this.mode, {
      duration: 30000,
    });
    await super.init();
  }

  protected async load(): Promise<void> {
    await super.load();
    await AssetsLoader.load('CITY3');
  }

  protected create(): void {
    super.create();
    this.timer = new Timer();
    this.score = new Score();
    this.background = new ParallaxBackground(['city3-1','city3-2', 'city3-3', 'city3-4', 'city3-5']);

    this.wrapper.addChildAt(this.background, 0);
    this.wrapper.addChild(this.timer, this.score);

    this.updateTimer();
    this.updateScore();
  }

  protected resize(size: Size): void {
    super.resize(size);
    this.timer.resize(size);
    this.score.resize(size);
    this.background.resize(size);
  }

  private stopTimer() {
    clearInterval(this.intervalId);
  }

  private updateScore() {
    const { score } = blastGameStore.getProgress();
    this.score.updateScore(score);
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
    blastGameStore.on('update', this.updateScore, this);
    this.intervalId = setInterval(() => this.updateTimer(), 200);
  }
}
