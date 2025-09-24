export enum Mode {
  DEFAULT = 'DEFAULT',
  TIMED = 'TIMED'
}

export type TTimedModeProgress = {
  type: Mode.TIMED;
  score: number;
  startTime: number;
  currentTime: number;
  duration: number;
}

export type TDefaultModeProgress = {
  type: Mode.DEFAULT;
  score: number;
  step: number;
  goal: number;
}

export type TProgress = TTimedModeProgress | TDefaultModeProgress;

export interface IGameMode {
  init(state: unknown): void;
  update(count: number): void;
  getProgress(): TProgress;
}

export type TTimedModeInitState = {
  duration: number;
}

export type TDefaultModeInitState = {
  goal: number;
  step: number;
  score: number;
}

export type TInitState = TTimedModeInitState | TDefaultModeInitState;
