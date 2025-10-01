import { Container, Sprite, type Size } from 'pixi.js';

import { Text } from '@/shared';

export class Score extends Container {
  private frame = Sprite.from('ui/panel_score');

  private scoreLabel = this.createScoreLabel();

  private scoreValue = this.createScoreValueText();

  private defaultSize: Size = {
    width: this.frame.width,
    height: this.frame.height,
  };

  constructor() {
    super();
    this.pivot.set(this.defaultSize.width, this.defaultSize.height * 0.5);
    this.addChild(this.frame, this.scoreLabel, this.scoreValue);
  }

  private createScoreLabel() {
    const text = new Text('SCORE', {
      fontSize: 130,
    });

    text.anchor.set(0.5);
    text.x = this.frame.width * 0.5;
    text.y = this.frame.height * 0.74;

    return text;
  }

  private createScoreValueText() {
    const text = new Text('0', {
      fontSize: 150,
    });

    text.anchor.set(0.5);
    text.x = this.frame.width * 0.5;
    text.y = this.frame.height * 0.3;

    return text;
  }

  updateScore(value: number) {
    this.scoreValue.text = value;
  }

  public resize({ width, height }: Size) {
    const scale = Math.min(
      width * 0.4 / this.defaultSize.width,
      height * 0.35 / this.defaultSize.height,
    );
    this.position.set(width * 0.95, height * 0.5);
    this.scale.set(scale);
  }
}
