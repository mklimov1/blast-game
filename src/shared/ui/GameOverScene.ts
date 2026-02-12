import { Tween } from '@tweenjs/tween.js';
import { type Size } from 'pixi.js';

import { sceneManager } from '@/app';
import {
  globalTweenGroup,
  Button,
  Text,
  AssetsLoader,
  appEventEmitter,
  Scene,
  StarField,
} from '@/shared';

export class GameOverScene extends Scene {
  private background!: StarField;

  protected text: string = '';

  private textEl!: Text;

  private button!: Button;

  protected create() {
    this.background = new StarField();
    this.textEl = this.createText(this.text);
    this.button = new Button('MENU', 1);

    this.view.addChild(this.background, this.textEl, this.button);

    this.hide(false);
  }

  protected async load() {
    await AssetsLoader.load('UI');
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('UISOUNDS');
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
      .group(globalTweenGroup)
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

  private resizeButton({ width, height }: Size) {
    const { button } = this;
    const scale = Math.min(
      (height * 0.15) / button.defaultSize.height,
      (width * 0.45) / button.defaultSize.width,
    );

    button.scale.set(scale);
    button.position.set(width * 0.5, height * 0.5 + button.height * 0.6);
  }

  private resizeText({ width, height }: Size) {
    const text = this.textEl;
    const scale = Math.min(
      (height * 0.15) / text.defaultSize.height,
      (width * 0.7) / text.defaultSize.width,
    );

    text.scale.set(scale);
    text.position.set(width * 0.5, height * 0.5 - text.height * 0.6);
  }

  private resize(size: Size) {
    this.background.resize(size);
    this.resizeText(size);
    this.resizeButton(size);
  }

  finishScene() {
    this.background.stop();
    super.finishScene();
    sceneManager.changeScene('mainMenu');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.button.off('pointertap', this.finishScene, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.button.on('pointertap', this.finishScene, this);
  }
}
