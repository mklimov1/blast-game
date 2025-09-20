import { Application, Ticker } from "pixi.js";

import { MainMenu } from "@/pages/main-menu/ui/MainMenu";
import { AssetsLoader } from "@/shared/lib";
import { blockGroup, gameOverScreenGroup, progressGroup, sceneGroup } from "@/shared/lib/tween";
import { sceneManager } from "@/shared/scene/SceneManager";

import type { SceneMap } from "./types";

export default class App {
  private app = new Application();

  private scenes: SceneMap = {
    mainMenu: MainMenu,
  };

  private node!: HTMLElement;

  private ticker = new Ticker();

  public async init(node: HTMLElement) {
    await this.app.init({
      backgroundColor: '#83CFFF',
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
    // this.scene.init();
    // this.app.stage.addChild(this.scene.view);
    // this.playScene('mainMenu');
    // appEventEmitter.emit('playScene', 'mainMenu');
    sceneManager.changeScene('mainMenu');
  }

  public render() {
    this.node.appendChild(this.app.canvas);
    this.app.resizeTo = this.node;
    this.ticker.add(() => {
      blockGroup.update();
      progressGroup.update();
      gameOverScreenGroup.update();
      sceneGroup.update();
    });
    this.ticker.start();
  }
}
