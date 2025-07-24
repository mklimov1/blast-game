import { Container } from "pixi.js";

import Field from "@/widgets/game-field";

import { Progress } from "./Progress";

export default class Scene {
  public view = new Container();

  private chipField!: Field;

  private create() {
    const progress = new Progress();

    this.chipField = new Field();

    this.view.addChild(this.chipField, progress);
  }

  public init() {
    this.create();
  }
}
