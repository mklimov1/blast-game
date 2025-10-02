import { type Size } from 'pixi.js';

import { sceneManager } from '@/app';
import { appEventEmitter, AssetsLoader, animations, Scene, Button, StarField, Text } from '@/shared';

export class MainMenu extends Scene {
  private playClassicButton!: Button;

  private playTimerButton!: Button;

  private background!: StarField;

  private title = this.createTitleText();

  protected create() {
    this.playClassicButton = new Button('CLASSIC', 2);
    this.playTimerButton = new Button('TIMER', 2);
    this.background = new StarField('#1A1A2E');

    this.view.addChild(
      this.background,
      this.title,
      this.playClassicButton,
      this.playTimerButton,
    );

  }

  private createTitleText() {
    const text = new Text('BLAST GAME');
    text.anchor.set(0.5);
    return text;
  }

  protected show() {
    animations.show(this.view);
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
    button.scale.set(size.height * 0.15 / button.defaultSize.height);
    button.x = size.width * 0.5;
    button.y = size.height * 0.5 + button.height * yOffset;
  }

  private resizeTitle(size: Size) {
    const defaultHeight = this.title.height / this.title.scale.y;

    this.title.scale.set(size.height * 0.1 / defaultHeight);
    this.title.x = size.width * 0.5;
    this.title.y = size.height * 0.3;
  }

  private resize(size: Size) {
    this.background.width = size.width;
    this.background.height = size.height;

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
