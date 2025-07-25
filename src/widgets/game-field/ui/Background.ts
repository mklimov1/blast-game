import { Sprite, Texture } from "pixi.js";

export default class Background extends Sprite {
  constructor() {
    super(Texture.from('field'));
    this.anchor.set(0.5, 0.492);
  }
}
