import { Container, Sprite, type Size } from 'pixi.js';

import { blastGameStore } from '@/pages/blast-game/model/blastGameStore';
import { Mode, type TProgress } from '@/pages/blast-game/model/game-mode/types';
import { Text } from '@/shared/ui/Text';

export class GameStats extends Container {
  private frame = Sprite.from('ui/panel_score');

  private attemptsLeftText = this.createAttemptsLeftText();

  private scoreLabel = this.createScoreLabel();

  private scoreValueText = this.createScoreValueText();

  private defaultSize: Size = {
    width: this.frame.width,
    height: this.frame.height,
  };

  constructor(attempts: number) {
    super();
    this.pivot.set(this.defaultSize.width, this.defaultSize.height * 0.5);

    this.attemptsLeftText.text = attempts;

    this.addChild(this.frame, this.attemptsLeftText, this.scoreLabel, this.scoreValueText);
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

  public resize({ width, height }: Size) {
    const scale = Math.min(
      width * 0.4 / this.defaultSize.width,
      height * 0.35 / this.defaultSize.height,
    );
    this.position.set(width * 0.95, height * 0.5);
    this.scale.set(scale);
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
