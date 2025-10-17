import { BlockColor } from './../types';

const COLORS = Object.values(BlockColor);

export const getRandomBlockColor = (maxColors: number): BlockColor =>
  COLORS[Math.floor(Math.random() * maxColors)];
