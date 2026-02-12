import { sound } from '@pixi/sound';

import { AssetsLoader, GameOverScene } from '@/shared';

export class GameLose extends GameOverScene {
  protected text = 'YOU LOSE:(';

  protected async load() {
    await super.load();
    await AssetsLoader.load('GAMELOSE');
  }

  show(animate = true) {
    sound.play('lose');
    super.show(animate);
  }
}
