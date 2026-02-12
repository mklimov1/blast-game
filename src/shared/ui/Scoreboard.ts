import { Container, Sprite, type Size } from 'pixi.js';

import type { Breakpoint } from '../types/responsive';

export class Scoreboard extends Container {
  protected frame: Sprite;

  constructor() {
    super();
    this.frame = Sprite.from('game/panel_score');

    this.pivot.set(this.frame.width * 0.5, this.frame.height * 0.5);
    this.addChild(this.frame);
  }

  public resize({ width, height }: Size, breakpoint?: Breakpoint) {
    const scale = Math.min((width * 0.6) / this.frame.width, (height * 0.25) / this.frame.height);
    this.scale.set(scale);

    if (breakpoint === 'mobile' || breakpoint === 'tablet') {
      this.position.set(width * 0.5, height - this.frame.height * 0.5 * scale);
      return;
    }
    this.position.set(width - this.frame.width * 0.5 * scale, height * 0.5);
  }
}
