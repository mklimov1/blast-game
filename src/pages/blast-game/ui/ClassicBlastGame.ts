import BlastGame from './BlastGame';
import { blastGameStore } from '../model/blastGameStore';
import { Mode } from '../model/game-mode/types';

export class ClassicBlastGame extends BlastGame {
  private mode = Mode.CLASSIC;

  public async init() {
    await super.init();
    blastGameStore.init(this.mode, {
      goal: 100,
      step: 20,
      score: 0,
    });
  }
}
