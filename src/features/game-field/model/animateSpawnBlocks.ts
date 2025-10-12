import type { BlockView } from '@/entities';
import { delay } from '@/shared';

import { Chip } from './Chip';
import { moveChipOnGrid } from './moveChipOnGrid';

export const animateSpawnBlocks = async (
  viewBlocks: BlockView[],
  blockMap: Map<string, Chip>,
): Promise<void> => {
  const byColumn: Record<number, BlockView[]> = {};

  viewBlocks.forEach(block => {
    const { col } = blockMap.get(block.id) as Chip;
    if (!byColumn[col]) byColumn[col] = [];
    byColumn[col].push(block);
    block.alpha = 0;
  });

  const maxLength = Object.values(byColumn).reduce(
    (max, arr) => Math.max(max, arr.length),
    0,
  );

  const promises: Promise<void>[] = [];

  for (let i = 0; i < maxLength; i++) {
    for (const colBlocks of Object.values(byColumn)) {
      const block = colBlocks[i];
      if (!block) continue;

      const chip = blockMap.get(block.id);
      if (!chip) continue;
      chip.prevRow = -1;
      block.setGridPosition(chip.prevRow, chip.col);
      block.show();
      promises.push(moveChipOnGrid(chip, block));
    }

    await delay(100);
  }

  await Promise.all(promises);
};
