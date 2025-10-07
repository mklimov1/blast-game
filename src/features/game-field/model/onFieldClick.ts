import type { BlockView } from '@/entities';
import { blastGameStore } from '@/pages';
import type { Field } from '@/widgets';

import { applyGravity } from './applyGravity';
import { destroyBlocks } from './destroyBlocks';
import { fieldStore } from './FieldStore';
import { findConnected } from './findConnected';
import { sortByDistance } from './sortByDistance';
import { spawnNewBlocks } from './spawnNewBlocks';
import { syncBlocks } from './syncBlocks';

import type { FederatedPointerEvent } from 'pixi.js';

export const onFieldClick = async (e: FederatedPointerEvent, field: Field) => {
  const chip = field.getChipByPosition({ x: e.globalX, y: e.globalY });
  if (!chip) return;

  const grid = fieldStore.getGrid();
  const { row, col } = chip.getBlock();
  if (!grid?.[row]?.[col]) return;

  const { blockContainer } = field;
  const positions = findConnected(grid, row, col);

  if (positions.length < 3) return;
  const sortedPositions = sortByDistance(positions, { row, col });
  const displayBlocks = blockContainer.children as BlockView[];

  await destroyBlocks(sortedPositions, displayBlocks);
  applyGravity(grid);
  syncBlocks(displayBlocks);
  const newBlocks = fieldStore.fill();
  await spawnNewBlocks(newBlocks, blockContainer, true);
  blastGameStore.update(positions.length);
};
