import { BlockColor } from '../model';

export const getRandomBlockColor = (maxColors: number): BlockColor => {
  const colors = Object.values(BlockColor);
  return colors[Math.floor(Math.random() * maxColors)];
};
