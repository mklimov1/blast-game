import { Container } from "pixi.js";

export abstract class Scene {
  public view = new Container();

  protected abstract load(): void;

  abstract init(): void;

  protected abstract unsubscribeEvents(): void;

  protected abstract subscribeEvents(): void;

  protected abstract show(): void;

  abstract finishScene(): void;

  abstract destroy(): void;
}
