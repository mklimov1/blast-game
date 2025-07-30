export const forEachGridBottomRight = <T>(
  grid: T[][],
  callback: (row: number, col: number, item: T | null, grid:T[][] ) => void,
) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let row = rows - 1; row >= 0; row--) {
    for (let col = cols - 1; col >= 0; col--) {
      callback(row, col, grid[row][col], grid);
    }
  }
};
