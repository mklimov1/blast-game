import { sound } from '@pixi/sound';
import { Container, Sprite, type Size } from 'pixi.js';

import { Text } from './Text';

type ButtonType = 1 | 2;

export class Button extends Container {
  private text: Text;

  private button: Sprite;

  defaultSize: Size;

  constructor(text: string, buttonType: ButtonType) {
    super();
    this.text = this.createText(text);
    this.button = this.createButton(buttonType);
    this.defaultSize = {
      width: this.button.width,
      height: this.button.height,
    };
    this.addChild(this.button, this.text);
    this.eventMode = 'static';
    this.cursor = 'pointer';

    const textScale = Math.min((this.defaultSize.width * 0.85) / this.text.width, 1);
    this.text.scale.set(textScale);

    this.on('pointerenter', this.onPointerEnter, this);
    this.on('pointerleave', this.onPointerLeave, this);
    this.on('pointertap', this.clickSound, this);
  }

  private clickSound() {
    if (!sound.exists('click')) return;
    sound.play('click');
  }

  override destroy(options?: boolean | Parameters<typeof Container.prototype.destroy>[0]): void {
    this.off('pointerenter', this.onPointerEnter, this);
    this.off('pointerleave', this.onPointerLeave, this);
    this.off('pointertap', this.clickSound, this);
    super.destroy(options);
  }

  private onPointerEnter() {
    this.tint = '#dddddd';
  }

  private onPointerLeave() {
    this.tint = '#ffffff';
  }

  private createText(text: string) {
    const textObject = new Text(text);

    textObject.anchor.set(0.5);

    return textObject;
  }

  private createButton(buttonType: ButtonType) {
    const button = Sprite.from(`button-${buttonType}`);

    button.anchor.set(0.5, 0.45);

    return button;
  }
}
