import { Filter, GlProgram, Ticker } from 'pixi.js';

/**
 * Cyberpunk glitch filter.
 *
 * Эффекты:
 * - Горизонтальный сдвиг случайных полос
 * - Chromatic aberration (разделение RGB-каналов)
 * - Опциональные scanlines
 *
 */

const vertex = /* glsl */ `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition(void) {
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
    return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord(void) {
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void) {
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
  }
`;

const fragment = /* glsl */ `
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;

  uniform float uTime;          // анимация (секунды или счётчик кадров)
  uniform float uIntensity;     // 0 = нет эффекта, 1 = полный glitch
  uniform float uSliceCount;    // количество горизонтальных полос
  uniform float uRgbSplit;      // сила разделения RGB-каналов
  uniform float uScanlines;     // интенсивность scanlines (0 = выкл)

  // ── Псевдо-рандом из координаты ──
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // Рандом для полосы: зависит от Y и времени
  float sliceRand(float y, float t) {
    // floor(y * sliceCount) даёт номер полосы
    float slice = floor(y * uSliceCount);
    // Меняем seed каждые ~0.1 секунды для дёрганого эффекта
    float timeSeed = floor(t * 10.0);
    return hash(slice * 113.7 + timeSeed * 27.3);
  }

  void main(void) {
    vec2 uv = vTextureCoord;

    float rand = sliceRand(uv.y, uTime);

    // Только часть полос сдвигается (примерно 30% при intensity=1)
    float isGlitched = step(0.7, rand);

    float shift = (hash(rand * 7.13 + uTime) * 2.0 - 1.0) * uIntensity * 0.15;

    uv.x += shift * isGlitched;

    float rgbOffset = uRgbSplit * uIntensity * 0.01;

    float r = texture(uTexture, vec2(uv.x + rgbOffset, uv.y)).r;
    float g = texture(uTexture, uv).g;
    float b = texture(uTexture, vec2(uv.x - rgbOffset, uv.y)).b;
    float a = texture(uTexture, uv).a;

    vec4 color = vec4(r, g, b, a);

    if (uScanlines > 0.0) {
      float scanline = sin(uv.y * 800.0) * 0.5 + 0.5;
      color.rgb -= scanline * uScanlines * 0.15;
    }

    gl_FragColor = color;
  }
`;

export interface GlitchFilterOptions {
  intensity?: number;
  sliceCount?: number;
  rgbSplit?: number;
  scanlines?: number;
  autoPlay?: boolean;
  speed?: number;
}

export class GlitchFilter extends Filter {
  public speed: number;

  private _tickerCallback: (() => void) | null = null;

  constructor(options: GlitchFilterOptions = {}) {
    const {
      intensity = 0.5,
      sliceCount = 20,
      rgbSplit = 3,
      scanlines = 0,
      autoPlay = true,
      speed = 1,
    } = options;

    const glProgram = GlProgram.from({ vertex, fragment });

    super({
      glProgram,
      resources: {
        glitchUniforms: {
          uTime: { value: 0, type: 'f32' },
          uIntensity: { value: intensity, type: 'f32' },
          uSliceCount: { value: sliceCount, type: 'f32' },
          uRgbSplit: { value: rgbSplit, type: 'f32' },
          uScanlines: { value: scanlines, type: 'f32' },
        },
      },
    });

    this.speed = speed;

    if (autoPlay) {
      this.play();
    }
  }

  play(): void {
    if (this._tickerCallback) return;

    this._tickerCallback = () => {
      this.time += Ticker.shared.deltaTime * 0.016 * this.speed;
    };

    Ticker.shared.add(this._tickerCallback);
  }

  stop(): void {
    if (!this._tickerCallback) return;

    Ticker.shared.remove(this._tickerCallback);
    this._tickerCallback = null;
  }

  override destroy(): void {
    this.stop();
    super.destroy();
  }

  get time(): number {
    return this.resources.glitchUniforms.uniforms.uTime;
  }

  set time(v: number) {
    this.resources.glitchUniforms.uniforms.uTime = v;
  }

  get intensity(): number {
    return this.resources.glitchUniforms.uniforms.uIntensity;
  }

  set intensity(v: number) {
    this.resources.glitchUniforms.uniforms.uIntensity = v;
  }

  get sliceCount(): number {
    return this.resources.glitchUniforms.uniforms.uSliceCount;
  }

  set sliceCount(v: number) {
    this.resources.glitchUniforms.uniforms.uSliceCount = v;
  }

  get rgbSplit(): number {
    return this.resources.glitchUniforms.uniforms.uRgbSplit;
  }

  set rgbSplit(v: number) {
    this.resources.glitchUniforms.uniforms.uRgbSplit = v;
  }

  get scanlines(): number {
    return this.resources.glitchUniforms.uniforms.uScanlines;
  }

  set scanlines(v: number) {
    this.resources.glitchUniforms.uniforms.uScanlines = v;
  }
}
