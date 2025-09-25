import { Application, Ticker } from 'pixi.js';

import { ClassicBlastGame } from '@/pages/blast-game/ui/ClassicBlastGame';
import { TimerBlastGame } from '@/pages/blast-game/ui/TimerBlastGame';
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
