import { Tween } from "@tweenjs/tween.js";
import { Container, Graphics, type Size } from "pixi.js";

import { gameOverScreenGroup } from "@/shared/lib/tween";
import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { sceneEventEmitter } from "@/widgets/game-scene/model/sceneEventEmitter";

export class GameOverScreen extends Container {
  private background: Graphics;

  private text: Text;

  private button: Button;

  constructor(text: string) {
    super();
    this.background = this.createBackground();
    this.text = this.createText(text);
    this.button = new Button('restart', 1);

    this.addChild(this.background, this.text, this.button);
    this.subscribeEvents();

    this.hide(false);
  }

  private createText(text: string) {
    const textObject = new Text(text, {
      fontSize: 120,
    });

    textObject.anchor.set(0.5);

    return textObject;
  }

  private createBackground() {
    const graphics = new Graphics();

    graphics
      .rect(0, 0, 1000, 1000)
      .fill({
        color: '#000000',
        alpha: 0.7,
      });

    return graphics;
  }

  private animate(show: boolean, onComplete?: () => void) {
    const from = show ? 0 : 1;
    const to = show ? 1 : 0;

    this.alpha = from;

    return new Tween({ alpha: from })
      .to({ alpha: to })
      .onUpdate(({ alpha }) => {
        this.alpha = alpha;
      })
      .group(gameOverScreenGroup)
      .duration(400)
      .onComplete(onComplete)
      .start();
  }

  show(animate = true) {
    this.visible = true;
    if (animate) {
      this.animate(true);
    }
  }

  hide(animate = true) {
    if (animate) {
      this.animate(false, () => {
        this.visible = false;
      });
    } else {
      this.visible = false;
    }
  }

  private resize({ width, height }: Size) {
    this.background.width = width;
    this.background.height = height;

    this.text.position.set(
      width * 0.5,
      height * 0.5,
    );
    this.button.position.set(
      width * 0.5,
      height * 0.5 + this.button.height,
    );
  }

  private subscribeEvents() {
    sceneEventEmitter.on('scene:resize', this.resize, this);
    this.button.on('pointerup', () => {
      sceneEventEmitter.emit('game:restart');
    });
  }
}
