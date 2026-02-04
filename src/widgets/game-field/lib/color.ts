import { Color } from '../types';

const COLORS = Object.values(Color);

export const getRandomBlockColor = (maxColors: number): Color =>
  COLORS[Math.floor(Math.random() * maxColors)];

export const getColorByIndex = (index: number): Color => COLORS[index];
