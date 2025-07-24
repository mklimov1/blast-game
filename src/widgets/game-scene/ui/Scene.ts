import { Container } from "pixi.js";

import Field from "@/widgets/game-field";

export default class Scene {
  public view = new Container();

  private chipField!: Field;

  private create() {
    this.chipField = new Field();

    this.view.addChild(this.chipField);
  }

  public init() {
    this.create();
  }
}
