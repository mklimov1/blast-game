import { Assets, type Size, Sprite, type Texture } from 'pixi.js';

import { SoundSettings } from '../lib/sound/SoundSettings';

export class SoundToggleButton extends Sprite {
  private _texOn: Texture;

  private _texOff: Texture;

  defaultSize: Size;

  constructor() {
    super();
    this._texOn = Assets.get('soundOn');
    this._texOff = Assets.get('soundOff');

    this.anchor.set(0.5);
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.defaultSize = {
      width: this._texOn.width,
      height: this._texOn.height,
    };

    this.on('pointertap', this._onToggle, this);
    this.on('pointerenter', this._onPointerEnter, this);
    this.on('pointerleave', this._onPointerLeave, this);

    this.setTexture();
  }

  private setTexture() {
    this.texture = SoundSettings.enabled ? this._texOn : this._texOff;
  }

  private _onToggle() {
    SoundSettings.toggle();
    this.setTexture();
  }

  private _onPointerEnter() {
    this.tint = '#dddddd';
  }

  private _onPointerLeave() {
    this.tint = '#ffffff';
  }

  resize(size: Size) {
    const scale = Math.min(
      (size.height * 0.08) / this.defaultSize.height,
      (size.width * 0.15) / this.defaultSize.width,
    );

    this.scale.set(scale);

    this.x = size.width - this.width * 0.7;
    this.y = this.height * 0.7;
  }
}
