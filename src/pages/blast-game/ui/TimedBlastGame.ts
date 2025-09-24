import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

export class TimedBlastGame extends BlastGame {
  private mode = Mode.TIMED;

  public async init() {
    await super.init();
    blastGameStore.init(this.mode, {
      duration: 10000,
    });
  }
}
