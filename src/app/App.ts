import { Application, Ticker } from 'pixi.js';

import { DefaultBlastGame } from '@/pages/blast-game/ui/DefaultBlastGame';
import { TimedBlastGame } from '@/pages/blast-game/ui/TimedBlastGame';
import { GameLose } from '@/pages/game-lose/ui/GameLose';
import { GameWin } from '@/pages/game-win/ui/GameWin';
import { MainMenu } from '@/pages/main-menu/ui/MainMenu';
import { AssetsLoader } from '@/shared/lib';
import { tweenGroup } from '@/shared/lib/tween';
import { sceneManager } from '@/shared/scene/SceneManager';

import type { SceneMap } from './types';

export default class App {
  private app = new Application();

  private scenes: SceneMap = {
    mainMenu: MainMenu,
    gameWin: GameWin,
    gameLose: GameLose,
    defaultBlastGame: DefaultBlastGame,
    timedBlastGame: TimedBlastGame,
  };

  private node!: HTMLElement;

  private ticker = new Ticker();

  public async init(node: HTMLElement) {
    await this.app.init({
      backgroundColor: '#000000',
    });
    await AssetsLoader.init();
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('PROGRESS-BAR');
    await AssetsLoader.load('UI');
    await AssetsLoader.load('BUTTONS');

    sceneManager.init(this.scenes, this.app.stage, node);
    this.node = node;
  }

  public create() {
    sceneManager.changeScene('mainMenu');
  }

  public render() {
    this.node.appendChild(this.app.canvas);
    this.app.resizeTo = this.node;
    this.ticker.add(() => {
      tweenGroup.update();
    });
    this.ticker.start();
  }
}
