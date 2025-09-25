export enum Mode {
  CLASSIC = 'CLASSIC',
  TIMER = 'TIMER'
}

export type TTimerModeProgress = {
  type: Mode.TIMER;
  score: number;
  startTime: number;
  currentTime: number;
  duration: number;
}

export type TClassicModeProgress = {
  type: Mode.CLASSIC;
  score: number;
  step: number;
  goal: number;
}

export type TProgress = TTimerModeProgress | TClassicModeProgress;

export interface IGameMode {
  init(state: unknown): void;
  update(count: number): void;
  getProgress(): TProgress;
}

export type TTimerModeInitState = {
  duration: number;
}

export type TClassicModeInitState = {
  goal: number;
  step: number;
  score: number;
}

export type TInitState = TTimerModeInitState | TClassicModeInitState;
