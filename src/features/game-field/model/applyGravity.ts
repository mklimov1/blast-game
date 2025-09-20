import type { Grid } from './types';

export const applyGravity = (grid: Grid) => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let col = 0; col < cols; col++) {
    let emptyRow = rows - 1;

    for (let row = rows - 1; row >= 0; row--) {
      const block = grid[row][col];

      if (block) {
        if (row !== emptyRow) {
          grid[emptyRow][col] = block;
          block.col = col;
          block.row = emptyRow;
          grid[row][col] = null;
        }
        emptyRow--;
      }
    }
  }
};
