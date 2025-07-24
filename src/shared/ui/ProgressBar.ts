import { Container, Graphics, Sprite } from "pixi.js";

export class ProgressBar extends Container {
  private progress = Sprite.from('progress-bar/progress');

  constructor() {
    super();
    const { progress } = this;
    const frame = Sprite.from('progress-bar/frame');
    const mask = new Graphics();

    frame.anchor.set(0.5);
    progress.anchor.set(0.5);
    progress.y = frame.height * -0.03;

    mask
      .roundRect(0, 0, progress.width, progress.height, 40)
      .fill(0xffffff);
    mask.pivot.set(progress.width * 0.5, progress.height * 0.5);
    mask.x = progress.x;
    mask.y = progress.y;
    progress.mask = mask;

    this.addChild(frame, progress, mask);
  }

  setProgress(value: number) {
    this.progress.x = (value - 1) * this.progress.width;
  }
}
