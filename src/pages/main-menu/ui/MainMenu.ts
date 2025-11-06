import { type Size } from 'pixi.js';

import { sceneManager } from '@/app';
import { appEventEmitter, AssetsLoader, animations, Scene, Button, StarField, Text, tweenGroup } from '@/shared';

export class MainMenu extends Scene {
  private playClassicButton!: Button;

  private playTimerButton!: Button;

  private background!: StarField;

  private title = this.createTitleText();

  protected create() {
    this.playClassicButton = new Button('CLASSIC MODE', 2);
    this.playTimerButton = new Button('TIMER MODE', 2);
    this.background = new StarField('#1A1A2E');

    this.view.addChild(
      this.background,
      this.title,
      this.playClassicButton,
      this.playTimerButton,
    );

  }

  private createTitleText() {
    const text = new Text('BLAST GAME', {
      fontSize: 400,
    });
    text.anchor.set(0.5);
    return text;
  }

  protected show() {
    animations.show(this.view, tweenGroup);
    this.background.start();
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
  }

  public destroy() {
    this.background.stop();
    super.destroy();
  }

  private resizeButton(button: Button, size: Size, yOffset: number) {
    const scale = Math.min(
      size.height * 0.13 / button.defaultSize.height,
      size.width * 0.8 / button.defaultSize.width,
    );

    button.scale.set(scale);
    button.x = size.width * 0.5;
    button.y = size.height * 0.5 + button.height * yOffset;
  }

  private resizeTitle(size: Size) {
    const scale = Math.min(
      size.height * 0.1 / this.title.defaultSize.height,
      size.width * 0.9 / this.title.defaultSize.width,
    );

    this.title.scale.set(scale);
    this.title.x = size.width * 0.5;
    this.title.y = size.height * 0.3;
  }

  private resize(size: Size) {
    this.resizeButton(this.playClassicButton, size, 0);
    this.resizeButton(this.playTimerButton, size, 1.05);

    this.resizeTitle(size);
    this.background.resize(size);
  }

  playClassicBlastGame() {
    super.finishScene();
    sceneManager.changeScene('classicBlastGame');
  }

  playTimerBlastGame() {
    super.finishScene();
    sceneManager.changeScene('timerBlastGame');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.playClassicButton.off('pointertap', this.playClassicBlastGame, this);
    this.playTimerButton.off('pointertap', this.playTimerBlastGame, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.playClassicButton.on('pointertap', this.playClassicBlastGame, this);
    this.playTimerButton.on('pointertap', this.playTimerBlastGame, this);
  }
}
