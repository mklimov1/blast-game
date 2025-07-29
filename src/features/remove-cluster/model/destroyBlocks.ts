import type { BlockView } from "@/entities/ui/BlockView";
import type { Position } from "@/widgets/game-field/model/types";

export const destroyBlocks = (
  positions: Position[],
  grid: BlockView[][],
) => {
  if (positions.length >= 3) {
    const blocks = positions.map(({ row, col }) => grid[row][col]);

    blocks.forEach(block => {
      block.destoryBlock();
    });
  }
};
