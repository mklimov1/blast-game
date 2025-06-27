import { Assets, Sprite } from "pixi.js";

export default class FieldBackground extends Sprite {
  constructor() {
    const texture = Assets.get('field');
    super(texture);
    this.anchor.set(0.5);
  }
}
