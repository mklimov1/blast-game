import { EventEmitter } from 'pixi.js';

import { DefaultMode } from './game-mode/DefaultMode';
import { TimedMode } from './game-mode/TimedMode';

import type { IGameMode, TInitState, TProgress } from './game-mode/types';

export type BlastGameEvents = {
  update: (payload: TProgress) => void;
  finish: ({status: 'win'| 'lose', score: number})
};

const modeMap = {
  default: DefaultMode,
  timed: TimedMode,
};

class BlastGameStore extends EventEmitter<BlastGameEvents> {
  private mode!: IGameMode;

  init(mode: keyof typeof modeMap, initState: TInitState) {
    this.mode = new modeMap[mode]();

    this.mode.init(initState);
  }

  update(points: number) {
    this.mode.update(points);
    this.emit('update', this.getProgress());
  }

  getProgress() {
    return this.mode.getProgress();
  }
}

export const blastGameStore = new BlastGameStore();
