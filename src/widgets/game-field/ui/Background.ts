import { Assets, Sprite, type Size } from "pixi.js";

import { fieldEventEmitter } from "../lib";

export default class Background extends Sprite {
  constructor() {
    const texture = Assets.get('field');

    super(texture);
    this.anchor.set(0.5);
    this.subsctibeEvents();
  }

  private resize(size:Size) {
    const scale =  size.width / this.texture.width;

    this.scale.set(scale);
  }

  private subsctibeEvents() {
    fieldEventEmitter.on('resize', this.resize, this);
  }
}
