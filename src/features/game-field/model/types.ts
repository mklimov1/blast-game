import type { BlockColor } from "@/entities/model/blockColors";

export type Block = {
  row: number;
  col: number;
  color: BlockColor;
}

export type Grid = (Block | null)[][];
