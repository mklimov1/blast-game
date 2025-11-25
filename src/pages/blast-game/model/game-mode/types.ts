import type { Mode } from '@/shared';

import type EventEmitter from 'eventemitter3';

export type TTimerModeProgress = {
  type: Mode.TIMER;
  score: number;
  startTime: number;
  endTime: number;
  leftTime: number;
  currentTime: number;
  duration: number;
};

export type TClassicModeProgress = {
  type: Mode.CLASSIC;
  score: number;
  step: number;
  goal: number;
};

type Progress = {
  [Mode.CLASSIC]: TClassicModeProgress;
  [Mode.TIMER]: TTimerModeProgress;
};

export interface IGameMode<M extends Mode> extends EventEmitter {
  readonly type: M;
  update(count: number): void;
  getProgress(): Progress[M];
}

export type EventTypes = {
  update: () => void;
  finish: { status: 'win' | 'lose'; score: number };
};
