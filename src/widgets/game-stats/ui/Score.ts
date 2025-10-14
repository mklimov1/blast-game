import { Text } from '@/shared';
import { Scoreboard } from '@/shared/ui/Scoreboard';

export class Score extends Scoreboard {
  private scoreLabel = this.createScoreLabel();

  private scoreValue = this.createScoreValueText();

  constructor() {
    super();
    this.addChild(this.scoreLabel, this.scoreValue);
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
}
