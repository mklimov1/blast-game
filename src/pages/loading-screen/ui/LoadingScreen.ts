import { Graphics, type Size } from 'pixi.js';

import { animations, appEventEmitter, AssetsLoader, Scene, Text, tweenGroup } from '@/shared';

export class LoadingScreen extends Scene {
  private text!: Text;

  private background!: Graphics;

  protected create(): void {
    this.background = new Graphics();
    this.background.rect(0, 0, 300, 300);
    this.background.fill('#1A1A2E');

    this.text = this.createLoadingText('Loading...');

    this.view.addChild(this.background, this.text);
  }

  private createLoadingText(text: string) {
    const elem = new Text(text);
    elem.anchor.set(0.5);
    return elem;
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
  }

  protected show() {
    animations.show(this.view, tweenGroup);
  }

  private resize(size: Size) {
    const scale = Math.min(
      (size.width * 0.65) / this.text.defaultSize.width,
      (size.height * 0.1) / this.text.defaultSize.height,
    );

    this.text.scale.set(scale);
    this.text.position.set(size.width * 0.5, size.height * 0.5);

    this.background.width = size.width;
    this.background.height = size.height;
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
  }
}
