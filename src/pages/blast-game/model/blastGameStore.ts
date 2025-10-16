
import EventEmitter from 'eventemitter3';

import { ClassicMode } from './game-mode/ClassicMode';
import { TimerMode } from './game-mode/TimerMode';
import { Mode, type IGameMode, type TInitState, type TProgress } from './game-mode/types';

export type BlastGameEvents = {
  update: () => void;
  finish: ({status: 'win'| 'lose', score: number})
};

const modeMap = {
  [Mode.CLASSIC]: ClassicMode,
  [Mode.TIMER]: TimerMode,
};

class BlastGameStore extends EventEmitter<BlastGameEvents> {
  private mode!: IGameMode;

  init(mode: Mode, initState: TInitState) {
    this.mode = new modeMap[mode]();
    this.mode.init(initState);
  }

  update(points: number) {
    this.mode.update(points);
    this.emit('update');
  }

  getProgress(): TProgress {
    return this.mode.getProgress();
  }
}

export const blastGameStore = new BlastGameStore();
