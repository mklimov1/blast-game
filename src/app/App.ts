import { Application } from "pixi.js";

import { AssetsLoader, appEventEmitter } from "@/shared/lib";
import Scene from "@/widgets/game-scene";

export default class App {
  private app = new Application();

  private scene = new Scene();

  public async init() {
    await this.app.init({
      backgroundColor: '#83CFFF',
    });
    await AssetsLoader.init();
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('PROGRESS-BAR');
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
  }
}
