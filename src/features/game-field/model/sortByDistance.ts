import type { Position } from '@/widgets';

import type { Chip } from './Chip';

export const sortByDistance = (
  chips: Chip[],
  center: Position,
): Chip[] => {
  return [...chips].sort((a, b) => {
    const da = Math.abs(a.row - center.row) + Math.abs(a.col - center.col);
    const db = Math.abs(b.row - center.row) + Math.abs(b.col - center.col);
    return da - db;
  });
};
