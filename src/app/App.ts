import { Application, Ticker } from "pixi.js";

import { AssetsLoader, appEventEmitter } from "@/shared/lib";
import { blockGroup } from "@/shared/lib/tween";
import Scene from "@/widgets/game-scene";

export default class App {
  private app = new Application();

  private scene = new Scene();

  private ticker = new Ticker();

  public async init() {
    await this.app.init({
      backgroundColor: '#83CFFF',
    });
    await AssetsLoader.init();
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('PROGRESS-BAR');
    await AssetsLoader.load('UI');
  }

  public create() {
    this.scene.init();
    this.app.stage.addChild(this.scene.view);
  }

  public render(node: HTMLElement) {
    node.appendChild(this.app.canvas);
    this.app.resizeTo = node;
    appEventEmitter.emit('resize', {
      width: node.clientWidth,
      height: node.clientHeight,
    });
    this.ticker.add(() => {
      blockGroup.update();
    });
    this.ticker.start();
  }
}
