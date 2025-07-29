import type { BlockView } from "@/entities/ui/BlockView";
import type { Position } from "@/widgets/game-field/model/types";

export const findConnected = (
  grid: BlockView[][],
  startRow: number,
  startCol: number,
  visited: Set<string> = new Set<string>(),
): Position[] => {
  const key = `${startRow},${startCol}`;
  if (visited.has(key)) return [];

  visited.add(key);

  const color = grid[startRow][startCol]?.color;
  if (!color) return [];

  const neighbors: Position[] = [
    { row: startRow - 1, col: startCol },
    { row: startRow + 1, col: startCol },
    { row: startRow, col: startCol - 1 },
    { row: startRow, col: startCol + 1 },
  ];

  const connected: Position[] = [];

  for (const { row, col } of neighbors) {
    const block = grid?.[row]?.[col];
    const neighborKey = `${row},${col}`;

    if (!block || block.color !== color || visited.has(neighborKey)) continue;

    connected.push(...findConnected(grid, row, col, visited));
  }

  return [{ row: startRow, col: startCol }, ...connected];
};
