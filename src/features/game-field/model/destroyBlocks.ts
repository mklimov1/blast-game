import type { Grid, Position } from "@/widgets/game-field/model/types";

export const destroyBlocks = (
  positions: Position[],
  grid: Grid,
) => {
  if (positions.length >= 3) {
    positions.forEach(({ row, col }) => {
      const block = grid[row][col];
      if (!block) return;
      block.destoryBlock();
      grid[row][col] = null;
    });
  }
};
