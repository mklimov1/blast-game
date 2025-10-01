import type { BlockColor } from '@/entities';

export type Block = {
  row: number;
  col: number;
  color: BlockColor;
}

export type Grid = (Block | null)[][];
