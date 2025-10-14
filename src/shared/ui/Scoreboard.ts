import { Container, Sprite, type Size } from 'pixi.js';

export class Scoreboard extends Container {
  protected frame: Sprite;

  constructor() {
    super();
    this.frame = Sprite.from('ui/panel_score');

    this.pivot.set(this.frame.width * 0.5, this.frame.height * 0.5);
    this.addChild(this.frame);
  }

  public resize({ width, height }: Size) {
    const scale = Math.min(
      width * 0.4 / this.frame.width,
      height * 0.35 / this.frame.height,
    );
    this.position.set(width - (this.frame.width * 0.5) * scale, height * 0.5);
    this.scale.set(scale);
  }
}
