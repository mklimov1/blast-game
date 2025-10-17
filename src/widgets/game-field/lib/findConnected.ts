import { Chip } from './entities/Chip';

import type { Grid, Position } from '../types';

export const findConnected = (
  grid: Grid,
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Chip[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  visited.add(key);

  const targetBlock = grid[startRow][startCol];
  const color = targetBlock?.color;
  if (!color) return [];

  const neighbors: Position[] = [
    { row: startRow - 1, col: startCol },
    { row: startRow + 1, col: startCol },
    { row: startRow, col: startCol - 1 },
    { row: startRow, col: startCol + 1 },
  ];

  const connected: Chip[] = [];

  for (const { row, col } of neighbors) {
    const block = grid?.[row]?.[col];
    const neighborKey = `${row},${col}`;

    if (!block || block.color !== color || visited.has(neighborKey)) continue;

    connected.push(...findConnected(grid, row, col, visited));
  }

  return [targetBlock, ...connected];
};
