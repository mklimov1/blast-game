import { Container, Sprite } from "pixi.js";

import { Text } from "./Text";

type ButtonType = 1 | 2

export class Button extends Container {
  private text: Text;

  private button: Sprite;

  constructor(text: string, buttonType: ButtonType) {
    super();
    this.text = this.createText(text);
    this.button = this.createButton(buttonType);
    this.addChild(this.button, this.text);
  }

  private createText(text: string) {
    const textObject = new Text(text);

    textObject.anchor.set(0.5);

    return textObject;
  }

  private createButton(buttonType: ButtonType) {
    const button = Sprite.from(`buttons/${buttonType}`);

    button.anchor.set(0.5);

    return button;
  }
}
