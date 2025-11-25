import { delay, tweenGroup } from '@/shared';
import { fadeIn } from '@/shared/lib/animations';

import { Chip } from './entities/Chip';
import { moveChipOnGrid } from './moveChipOnGrid';

import type { RenderChip } from '../ui/RenderChip';

export type SpawnAnimation = 'fade' | 'drop' | 'none';

const drop = async (chip: Chip, renderChip: RenderChip) => {
  chip.prevRow = -1;
  renderChip.setGridPosition(chip.prevRow, chip.col);
  renderChip.show();
  return moveChipOnGrid(chip, renderChip);
};

const fade = async (_: Chip, renderChip: RenderChip) => {
  return fadeIn(renderChip, tweenGroup);
};

const animationMap: Record<SpawnAnimation, (chip: Chip, renderChip: RenderChip) => Promise<void>> =
  {
    drop,
    fade,
    none: async (_, renderChip: RenderChip) => {
      renderChip.show();
    },
  };

export const animateSpawnBlocks = async (
  viewBlocks: RenderChip[],
  blockMap: Map<string, Chip>,
  animation: SpawnAnimation = 'none',
): Promise<void> => {
  const byColumn: Record<number, RenderChip[]> = {};
  const animate = animationMap[animation];

  viewBlocks.forEach((block) => {
    const { col } = blockMap.get(block.id) as Chip;
    if (!byColumn[col]) byColumn[col] = [];
    byColumn[col].push(block);
    block.alpha = 0;
  });

  const maxLength = Object.values(byColumn).reduce((max, arr) => Math.max(max, arr.length), 0);

  const promises: Promise<void>[] = [];

  for (let i = 0; i < maxLength; i++) {
    for (const colBlocks of Object.values(byColumn)) {
      const renderChip = colBlocks[i];
      if (!renderChip) continue;

      const chip = blockMap.get(renderChip.id);
      if (!chip) continue;
      promises.push(animate(chip, renderChip));
    }

    if (animation !== 'none') {
      await delay(100);
    }
  }

  await Promise.all(promises);
};
