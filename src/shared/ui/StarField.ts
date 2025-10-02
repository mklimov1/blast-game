import { Container, Graphics, Ticker, type FillInput, type Size } from 'pixi.js';

interface Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    alpha: number;
}

export class StarField extends Container {
  private stars: Star[] = [];

  private backgroundColor: FillInput;

  private graphics: Graphics = new Graphics();

  private ticker: Ticker = new Ticker();

  private starCount: number;

  private screenSize: Size = { width: 0, height: 0 };

  constructor(backgroundColor: FillInput = { color: '#000000' }, starCount: number = 200) {
    super();
    this.starCount = starCount;
    this.backgroundColor = backgroundColor;

    this.addChild(this.graphics);
    this.ticker.add(this.update, this);
  }

  private createStars(size: Size) {
    this.width = size.width;
    this.height = size.height;

    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.screenSize.width,
        y: Math.random() * this.screenSize.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
  }

  private update() {
    const { screenSize } = this;

    this.graphics.clear();
    this.graphics.rect(0, 0, screenSize.width, screenSize.height);
    this.graphics.fill(this.backgroundColor);

    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > this.screenSize.height) {
        star.y = 0;
        star.x = Math.random() * this.screenSize.width;
      }

      this.graphics.rect(star.x, star.y, star.size, star.size);
    }
    this.graphics.fill('#ffffff');
  }

  public start() {
    this.ticker.start();
  }

  public stop() {
    this.ticker.stop();
  }

  public resize(size: Size) {
    this.screenSize = size;
    this.createStars(size);
  }
}
