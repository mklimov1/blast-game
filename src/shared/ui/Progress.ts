import { Container, Sprite, type Size } from 'pixi.js';

import { Text } from '@/shared';

import { ProgressBar } from './ProgressBar';

export class Progress extends Container {
  private frame = Sprite.from('progress-bar/progressBar');

  private text = new Text('PROGRESS');

  private progressBar = new ProgressBar();

  private defaultSize = {
    width: this.frame.width,
    height: this.frame.height,
  };

  constructor() {
    super();
    this.frame.anchor.set(0.5, 0);

    this.progressBar.y = this.frame.height * 0.65;

    this.text.anchor.set(0.5);
    this.text.y = this.frame.height * 0.23;

    this.addChild(this.frame, this.progressBar, this.text);
  }

  public resize({ width, height }: Size) {
    const scale = Math.min(
      width * 0.5 / this.defaultSize.width,
      height * 0.15 / this.defaultSize.height,
    );
    this.position.set(width * 0.5, 0);
    this.scale.set(scale);
  }

  public setProgress(payload: {score: number; goal: number}) {
    const animated = payload.score > 0;
    const progress = Math.min(payload.score / payload.goal, 1);

    this.progressBar.setProgress(progress, animated);
  }
}
