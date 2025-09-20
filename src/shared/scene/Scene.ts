import { Container } from "pixi.js";

export abstract class Scene {
  public view = new Container();

  protected abstract load(): void;

  protected abstract create(): void;

  async init() {
    await this.load();
    this.create();
    this.subscribeEvents();
    this.show();
  }

  protected abstract unsubscribeEvents(): void;

  protected abstract subscribeEvents(): void;

  protected abstract show(): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected finishScene(_payload?: unknown) {
    this.destroy();
  }

  protected destroy() {
    this.unsubscribeEvents();
    this.view.destroy();
  }
}
