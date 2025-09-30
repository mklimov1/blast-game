import { TextStyle, Text as PixiText, type TextStyleOptions } from 'pixi.js';

const defaultTextStyle: Partial<TextStyleOptions> = {
  fill: 0xffffff,
  fontFamily: 'PublicPixel',
  fontSize: 70,
};

export class Text extends PixiText {
  constructor(text: string, style?: Partial<TextStyleOptions>) {
    const textStyle = new TextStyle({
      ...defaultTextStyle,
      ...style,
    });

    super({
      text,
      style: textStyle,
    });
  }
}
