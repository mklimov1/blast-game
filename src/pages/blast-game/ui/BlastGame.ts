import { Container, type Size } from 'pixi.js';

import { fieldStore } from '@/features/game-field/model/FieldStore';
import { appEventEmitter, AssetsLoader } from '@/shared/lib';
import { show } from '@/shared/lib/animations';
import { delay } from '@/shared/lib/delay';
import { Scene } from '@/shared/scene/Scene';
import { sceneManager } from '@/shared/scene/SceneManager';
import Field from '@/widgets/game-field';

import { blastGameStore } from '../model/blastGameStore';

export default class BlastGame extends Scene {
  public view = new Container();

  protected wrapper!: Container;

  private chipField!: Field;

  protected create() {
    this.wrapper = new Container();
    this.chipField = new Field();

    this.wrapper.addChild(this.chipField);
    this.view.addChild(this.wrapper);
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
    await AssetsLoader.load('PROGRESS-BAR');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('UI');
  }

  public async init() {
    await super.init();
    this.enable();

    fieldStore.init(8, 8, 3);
    const blocks = fieldStore.fill();

    this.chipField.setup();
    this.chipField.fill(...blocks);
  }

  private enable() {
    this.chipField.enable();
  }

  private disable() {
    this.chipField.disable();
  }

  protected finishScene(isWin: boolean) {
    super.finishScene();
    sceneManager.changeScene(isWin ? 'gameWin' : 'gameLose');
  }

  protected show() {
    show(this.view);
  }

  protected unsubscribeEvents() {
    fieldStore.removeAllListeners();
    blastGameStore.removeAllListeners();
    appEventEmitter.off('resize', this.resize, this);
  }

  protected resize(size: Size) {
    this.chipField.resize(size);
  }

  private async win() {
    this.disable();
    await delay(1000);
    this.finishScene(true);
  }

  private async lose() {
    this.disable();
    await delay(1000);
    this.finishScene(false);
  }

  private finish({ status }: {status: 'win' | 'lose'}) {
    if (status === 'win') {
      this.win();
      return;
    } else if (status === 'lose') {
      this.lose();
    }
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    fieldStore.on('blocks:destroyed', this.disable, this);
    fieldStore.on('blocks:added', this.enable, this);
    blastGameStore.on('finish', this.finish, this);
  }
}
