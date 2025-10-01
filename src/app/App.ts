import { Application, Ticker } from 'pixi.js';

import { MainMenu, ClassicBlastGame, TimerBlastGame, GameLose, GameWin } from '@/pages';
import { AssetsLoader, tweenGroup } from '@/shared';

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
  };

  private node!: HTMLElement;

  private ticker = new Ticker();

  public async init(node: HTMLElement) {
    await this.app.init({
      backgroundColor: '#000000',
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });
    await AssetsLoader.init();
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
