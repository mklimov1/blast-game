import { Graphics, type Size } from 'pixi.js';

import { appEventEmitter, AssetsLoader } from '@/shared/lib';
import { show } from '@/shared/lib/animations';
import { Scene } from '@/shared/scene/Scene';
import { sceneManager } from '@/shared/scene/SceneManager';
import { AnimatedGrid } from '@/shared/ui/AnimatedGrid';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';
export class MainMenu extends Scene {
  private playClassicButton!: Button;

  private playTimerButton!: Button;

  private bgGrid!: AnimatedGrid;

  private background = this.createBackground();

  private title = this.createTitleText();

  protected create() {
    this.playClassicButton = new Button('classic mode', 2);
    this.playTimerButton = new Button('timer mode', 2);
    this.bgGrid = new AnimatedGrid(1000, 1000);

    this.view.addChild(
      this.background,
      this.bgGrid,
      this.title,
      this.playClassicButton,
      this.playTimerButton,
    );

  }

  private createBackground() {
    const g = new Graphics()
      .rect(0, 0, 100, 100)
      .fill('#1b1b21');

    return g;
  }

  private createTitleText() {
    const text = new Text('BLAST GAME');
    text.anchor.set(0.5);
    return text;
  }

  protected show() {
    show(this.view);
    this.bgGrid.start();
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
  }

  public destroy() {
    this.unsubscribeEvents();
    this.bgGrid.stop();
    this.view.destroy();
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
    this.bgGrid.resize(size.width, size.height);
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
    this.playClassicButton.off('click', this.playClassicBlastGame, this);
    this.playTimerButton.off('click', this.playTimerBlastGame, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.playClassicButton.on('click', this.playClassicBlastGame, this);
    this.playTimerButton.on('click', this.playTimerBlastGame, this);
  }
}
