import { Container, type Size } from "pixi.js";

import { appEventEmitter } from "@/shared/lib";

import Background from "./Background";
import { fieldEventEmitter } from "../lib";

export default class Field extends Container {
  private background = new Background();

  private size: Size = {
    width: 1000,
    height: 1000,
  };

  constructor() {
    super();
    this.addChild(this.background);
    this.subscribeEvents();
    fieldEventEmitter.emit('resize', this.size);
  }

  private resize({ width, height }: Size) {
    this.position.set(
      width * 0.5, height * 0.5,
    );

    this.scale.set(height * 0.5 / this.size.height);
  }

  private subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
  }
}
