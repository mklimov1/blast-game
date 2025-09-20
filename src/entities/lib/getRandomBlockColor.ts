import { blockColors, type BlockColor } from '../model/blockColors';

export const getRandomBlockColor = (maxColors: number): BlockColor => {
  return blockColors[Math.floor(Math.random() * maxColors)];

};
