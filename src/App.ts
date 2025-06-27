import { Application } from "pixi.js";

import AssetsLoader from "./AssetsLoader";
import Scene from "./scene/Scene";

export default class App {
  private app = new Application();

  private scene = new Scene();

  public async init() {
    await this.app.init({
      backgroundColor: '#83CFFF',
    });
    await AssetsLoader.load();
  }

  public create() {
    this.scene.init();
    this.app.stage.addChild(this.scene.view);
  }

  public render(node: HTMLElement) {
    node.appendChild(this.app.canvas);
    this.app.resizeTo = node;
  }
}
