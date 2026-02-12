import { sound } from '@pixi/sound';

import { AssetsLoader, GameOverScene } from '@/shared';

export class GameWin extends GameOverScene {
  protected text = 'GREAT!';

  protected async load() {
    await super.load();
    await AssetsLoader.load('GAMEWIN');
  }

  show(animate = true) {
    sound.play('win');
    super.show(animate);
  }
}
