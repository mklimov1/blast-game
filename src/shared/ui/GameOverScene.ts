import { Tween } from '@tweenjs/tween.js';
import { type Size } from 'pixi.js';

import { sceneManager } from '@/app';
import { tweenGroup, Button, Text, AssetsLoader, appEventEmitter, Scene, StarField } from '@/shared';

export class GameOverScene extends Scene {
  private background!: StarField;

  protected text: string = '';

  private textEl!: Text;

  private button!: Button;

  protected create() {
    this.background = new StarField();
    this.textEl = this.createText(this.text);
    this.button = new Button('MAIN MENU', 1);

    this.view.addChild(this.background, this.textEl, this.button);

    this.hide(false);
  }

  protected async load() {
    await AssetsLoader.load('BUTTONS');
    await AssetsLoader.load('FONTS');
  }

  private createText(text: string) {
    const textObject = new Text(text, {
      fontSize: 120,
    });

    textObject.anchor.set(0.5);

    return textObject;
  }

  private animate(show: boolean, onComplete?: () => void) {
    const from = show ? 0 : 1;
    const to = show ? 1 : 0;

    this.view.alpha = from;

    return new Tween({ alpha: from })
      .to({ alpha: to })
      .onUpdate(({ alpha }) => {
        this.view.alpha = alpha;
      })
      .group(tweenGroup)
      .duration(400)
      .onComplete(onComplete)
      .start();
  }

  show(animate = true) {
    this.view.visible = true;
    this.background.start();
    if (animate) {
      this.animate(true);
    }
  }

  hide(animate = true) {
    const cb = () => {
      this.view.visible = false;
    };

    if (animate) {
      this.animate(false, cb);
    } else {
      cb();
    }
  }

  private resize({ width, height }: Size) {
    this.background.resize({ width, height });

    this.textEl.position.set(
      width * 0.5,
      height * 0.5,
    );
    this.button.position.set(
      width * 0.5,
      height * 0.5 + this.button.height,
    );
  }

  finishScene() {
    this.background.stop();
    super.finishScene();
    sceneManager.changeScene('mainMenu');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.button.off('pointerup', this.finishScene, this);

  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.button.on('pointerup', this.finishScene, this);
  }
}
