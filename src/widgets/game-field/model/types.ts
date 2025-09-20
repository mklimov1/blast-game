import type { BlockView } from '@/entities/ui/BlockView';

export type GridSize = {
  rows: number;
  cols: number;
}

export type Position = { row: number; col: number };

export type Grid = (BlockView | null)[][];
