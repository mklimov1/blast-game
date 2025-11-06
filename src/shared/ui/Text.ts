import { TextStyle, Text as PixiText, type TextStyleOptions, type Size } from 'pixi.js';

const defaultTextStyle: Partial<TextStyleOptions> = {
  fill: 0xffffff,
  fontFamily: 'PublicPixel',
  fontSize: 70,
};

export class Text extends PixiText {
  readonly defaultSize: Size;

  constructor(text: string, style?: Partial<TextStyleOptions>) {
    const textStyle = new TextStyle({
      ...defaultTextStyle,
      ...style,
    });

    super({
      text,
      style: textStyle,
    });
    this.defaultSize = {
      width: this.width,
      height: this.height,
    };
  }
}
