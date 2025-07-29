import type { BlockView } from "@/entities/ui/BlockView";

export const applyGravity = (grid: (BlockView | null)[][]) => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let col = 0; col < cols; col++) {
    let emptyRow = rows - 1;

    for (let row = rows - 1; row >= 0; row--) {
      const block = grid[row][col];

      if (block) {
        if (row !== emptyRow) {
          grid[emptyRow][col] = block;
          grid[row][col] = null;

          block.setGridPosition(emptyRow, col);
        }
        emptyRow--;
      }
    }
  }
};
