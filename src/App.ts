import { Application } from "pixi.js";
import AssetsLoader from "./AssetsLoader";

export default class App {
  private app = new Application();

  public async init() {
    await this.app.init();
    await AssetsLoader.load();
  }

  public render(node: HTMLElement) {
    node.appendChild(this.app.canvas);
    this.app.resizeTo = node;
  }
}
