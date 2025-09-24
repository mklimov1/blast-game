import type { BlockView } from '@/entities/ui/BlockView';
import { destroyBlocks } from '@/features/game-field/model/destroyBlocks';
import { findConnected } from '@/features/game-field/model/findConnected';
import { blastGameStore } from '@/pages/blast-game/model/blastGameStore';

import { applyGravity } from './applyGravity';
import { fieldStore } from './FieldStore';
import { sortByDistance } from './sortByDistance';
import { spawnNewBlocks } from './spawnNewBlocks';
import { syncBlocks } from './syncBlocks';

import type { Container } from 'pixi.js';

export const onBlockClick = async (
  row: number,
  col: number,
  blockContainer: Container,
) => {
  const grid = fieldStore.getGrid();
  if (!grid?.[row]?.[col]) return;

  // eslint-disable-next-line no-console
  console.log(`Clicked block at row=${row}, col=${col}`);
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
