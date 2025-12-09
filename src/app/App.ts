import { Application } from 'pixi.js';

import { MainMenu, ClassicBlastGame, TimerBlastGame, GameLose, GameWin } from '@/pages';
import { LoadingScreen } from '@/pages/loading-screen';
import { AssetsLoader, globalTicker, tweenGroup } from '@/shared';

import { sceneManager } from './providers/sceneManager';

import type { SceneMap } from './types';

export class App {
  private app = new Application();

  private scenes: SceneMap = {
    mainMenu: MainMenu,
    gameWin: GameWin,
    gameLose: GameLose,
    classicBlastGame: ClassicBlastGame,
    timerBlastGame: TimerBlastGame,
    loading: LoadingScreen,
  };

  private node!: HTMLElement;

  public async init(node: HTMLElement) {
    await this.app.init({
      backgroundColor: '#000000',
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });
    await AssetsLoader.init();
    await sceneManager.init(this.scenes, this.app.stage, node, 'loading');
    this.node = node;
  }

  public create() {
    sceneManager.changeScene('mainMenu');
  }

  public render() {
    this.node.appendChild(this.app.canvas);
    this.app.resizeTo = this.node;
    globalTicker.add(() => {
      tweenGroup.update();
    }, this);
    globalTicker.start();
  }
}
