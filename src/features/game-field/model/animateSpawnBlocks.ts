import type { BlockView } from '@/entities';
import { delay } from '@/shared';

export const animateSpawnBlocks = async (viewBlocks: BlockView[]): Promise<void> => {
  const byColumn: Record<number, BlockView[]> = {};

  viewBlocks.forEach(block => {
    const { col } = block.getBlock();
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

      const { row, col } = block.getBlock();

      block.setGridPosition(-1, col);
      block.show();
      promises.push(block.moveOnGrid({ row, col }));
    }

    await delay(100);
  }

  await Promise.all(promises);
};
