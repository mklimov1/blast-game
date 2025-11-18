import { Color } from './../types';

const COLORS = Object.values(Color);

export const getRandomBlockColor = (maxColors: number): Color =>
  COLORS[Math.floor(Math.random() * maxColors)];
