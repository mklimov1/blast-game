import { Container } from "pixi.js";

import ChipField from "./ChipField";

export default class Scene {
  public view = new Container();

  private chipField = new ChipField();

  private create() {
    this.view.addChild(this.chipField);
  }

  public init() {
    this.create();
  }
}
