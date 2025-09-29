import { Container, Graphics, Ticker } from 'pixi.js';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const BASE_AREA = 1920 * 1080;
const BASE_COUNT = 80;
const BASE_DIST = 180;
const CIRCLE_COLOR = '#ffffff';

export class AnimatedGrid extends Container {
  private points: Point[] = [];

  private pointGraphics: Graphics;

  private lines: Graphics;

  private count: number = 60;

  private maxDist: number = 180;

  private areaWidth: number;

  private areaHeight: number;

  private ticker?: Ticker;

  constructor(width: number, height: number) {
    super();

    this.areaWidth = width;
    this.areaHeight = height;

    this.pointGraphics = new Graphics();
    this.lines = new Graphics();
    this.addChild(this.lines);
    this.addChild(this.pointGraphics);

    this.calculateCountAndDistance(width, height);
    this.createPoints();
  }

  private calculateCountAndDistance(width: number, height: number) {
    const currentArea = width * height;
    const scale = Math.sqrt(currentArea / BASE_AREA);

    this.count = Math.min(Math.max(20, Math.round(BASE_COUNT * scale)), 200);
    this.maxDist = Math.min(Math.max(50, BASE_DIST * scale), 400);
  }

  private createPoints() {
    this.points = [];
    this.pointGraphics.clear();

    for (let i = 0; i < this.count; i++) {
      const x = Math.random() * this.areaWidth;
      const y = Math.random() * this.areaHeight;
      const vx = (Math.random() - 0.5) * 0.8;
      const vy = (Math.random() - 0.5) * 0.8;

      this.points.push({ x, y, vx, vy });

      this.pointGraphics.circle(x, y, 2);
    }
    this.pointGraphics.fill(CIRCLE_COLOR);
  }

  private update = () => {
    for (const p of this.points) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.areaWidth) p.vx *= -1;
      if (p.y < 0 || p.y > this.areaHeight) p.vy *= -1;
    }

    this.pointGraphics.clear();
    for (const p of this.points) {
      this.pointGraphics.circle(p.x, p.y, 2);
    }
    this.pointGraphics.fill(CIRCLE_COLOR);

    this.lines.clear();
    this.lines.beginPath();
    const time = performance.now();
    const hueOffset = (time / 20) % 360;

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      for (let j = i + 1; j < this.points.length; j++) {
        const q = this.points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDist) {
          const alpha = 1 - dist / this.maxDist;
          const hue = (hueOffset + i * 10) % 360;
          const color = `hsl(${hue}, 100%, 60%)`;

          this.lines.moveTo(p.x, p.y);
          this.lines.lineTo(q.x, q.y);
          this.lines.stroke({ width: 1, color, alpha: alpha * 0.6 });
          this.lines.beginPath();
        }
      }
    }
  };

  public start(ticker: Ticker = Ticker.shared) {
    if (this.ticker) return;
    this.ticker = ticker;
    this.ticker.add(this.update);
  }

  public stop() {
    if (!this.ticker) return;
    this.ticker.remove(this.update);
    this.ticker.destroy();
    this.ticker = undefined;
  }

  public resize(width: number, height: number) {
    this.areaWidth = width;
    this.areaHeight = height;
    this.calculateCountAndDistance(width, height);
    this.createPoints();
    this.lines.clear();
    this.lines.beginPath();
  }
}
