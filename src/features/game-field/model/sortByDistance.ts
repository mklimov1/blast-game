import type { Position } from '@/widgets';

export const sortByDistance = (
  positions: Position[],
  center: Position,
): Position[] => {
  return [...positions].sort((a, b) => {
    const da = Math.abs(a.row - center.row) + Math.abs(a.col - center.col);
    const db = Math.abs(b.row - center.row) + Math.abs(b.col - center.col);
    return da - db;
  });
};
