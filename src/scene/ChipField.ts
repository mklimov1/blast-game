import { Container } from "pixi.js";

import FieldBackground from "./FieldBackground";

export default class ChipField extends Container {
  background = new FieldBackground();

  constructor() {
    super();
    this.addChild(this.background);
  }
}
