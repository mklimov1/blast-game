import { Container, Sprite, type Size } from 'pixi.js';

import { Text } from './Text';
import { formatTime } from '../lib';

export class Timer extends Container {
  private frame = Sprite.from('progress-bar/progressBar');

  private timer = this.createTimer();

  constructor() {
    super();
    this.frame.anchor.set(0.5, 0);
    this.addChild(this.frame, this.timer);
    this.frame.scale.set(0.5, 1);
    this.timer.y = this.frame.height * 0.45;
  }

  public setTime(ms: number) {
    const time = formatTime(ms);
    this.timer.text = time;
  }

  private createTimer() {
    const text = new Text('', {
      fontSize: 150,
    });
    text.anchor.set(0.5);
    return text;
  }

  public resize({ width, height }: Size) {
    const scale = Math.min(
      height * 0.1 / this.frame.height,
      width * 0.4 / this.frame.width,
    );

    this.position.set(width * 0.5, 0);
    this.scale.set(scale);
  }
}
