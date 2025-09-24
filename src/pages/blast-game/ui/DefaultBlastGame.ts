import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

export class DefaultBlastGame extends BlastGame {
  private mode = Mode.DEFAULT;

  public async init() {
    await super.init();
    blastGameStore.init(this.mode, {
      goal: 100,
      step: 20,
      score: 0,
    });
  }
}
