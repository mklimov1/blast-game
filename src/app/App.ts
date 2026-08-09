import { Application } from 'pixi.js';

import { ClassicBlastGame, GameLose, GameWin, MainMenu, TimerBlastGame } from '@/pages';
import { LoadingScreen } from '@/pages/loading-screen';
import { AssetsLoader, globalTicker, globalTweenGroup, initDebugStats } from '@/shared';
import { SoundSettings } from '@/shared/lib/sound/SoundSettings';

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
    SoundSettings.init();
    await sceneManager.init(this.scenes, this.app.stage, node, 'loading');
    this.node = node;

    initDebugStats(this.app.renderer);
  }

  public create() {
    sceneManager.changeScene('mainMenu');
  }

  public render() {
    this.node.appendChild(this.app.canvas);
    this.app.resizeTo = this.node;
    globalTicker.add(() => {
      globalTweenGroup.update();
    }, this);
    globalTicker.start();
  }
}
