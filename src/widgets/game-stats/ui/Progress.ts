import { Container, Sprite, type Size } from "pixi.js";

import { ProgressBar } from "@/shared/ui/ProgressBar";
import { Text } from "@/shared/ui/Text";
import { sceneEventEmitter } from "@/widgets/game-scene/model/sceneEventEmitter";
import type { GameUpdatePayload } from "@/widgets/game-scene/model/types";

export class Progress extends Container {
  private frame = Sprite.from('progress-bar/progressBar');

  private text = new Text('progress');

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
    this.text.y = this.frame.height * 0.2;

    this.addChild(this.frame, this.progressBar, this.text);

    this.subscribeEvents();
  }

  private resize({ width, height }: Size) {
    const scale = Math.min(
      width * 0.5 / this.defaultSize.width,
      height * 0.15 / this.defaultSize.height,
    );
    this.position.set(width * 0.5, 0);
    this.scale.set(scale);
  }

  private setProgress(payload: GameUpdatePayload) {
    const animated = payload.score > 0;
    const progress = Math.min(payload.score / payload.goal, 1);

    this.progressBar.setProgress(progress, animated);
  }

  private subscribeEvents() {
    sceneEventEmitter.on('scene:resize', this.resize, this);
    sceneEventEmitter.on('game:update-progress', this.setProgress, this);
  }
}
