import { Mode, type TProgress, blastGameStore } from '@/pages';
import { Text } from '@/shared';
import { Scoreboard } from '@/shared/ui/Scoreboard';

export class GameStats extends Scoreboard {
  private attemptsLeftText = this.createAttemptsLeftText();

  private scoreLabel = this.createScoreLabel();

  private scoreValueText = this.createScoreValueText();

  constructor(attempts: number) {
    super();

    this.attemptsLeftText.text = attempts;

    this.addChild(this.attemptsLeftText, this.scoreLabel, this.scoreValueText);
    this.subscribeEvents();
  }

  private createAttemptsLeftText() {
    const text = new Text('', {
      fontSize: 200,
    });
    text.anchor.set(0.5);
    text.x = this.frame.width * 0.51;
    text.y = this.frame.height * 0.3;

    return text;
  }

  private createScoreLabel() {
    const text = new Text('SCORE:', {
      fontSize: 85,
    });

    text.anchor.set(0.5);
    text.x = this.frame.width * 0.5;
    text.y = this.frame.height * 0.66;

    return text;
  }

  private createScoreValueText() {
    const text = new Text('0', {
      fontSize: 160,
    });

    text.anchor.set(0.5);
    text.x = this.frame.width * 0.5;
    text.y = this.frame.height * 0.79;

    return text;
  }

  private updateStats(payload: TProgress) {
    if (payload.type !== Mode.CLASSIC) return;
    this.attemptsLeftText.text = payload.step;
    this.scoreValueText.text = payload.score;
  }

  private subscribeEvents() {
    blastGameStore.on('update', this.updateStats, this);
  }
}
