import type { BlockView } from '@/entities';
import { blastGameStore } from '@/pages';
import type { Field } from '@/widgets';

import { Chip } from './Chip';
import { destroyBlocks } from './destroyBlocks';
import { fieldStore } from './FieldStore';
import { findConnected } from './findConnected';
import { moveChipOnGrid } from './moveChipOnGrid';
import { sortByDistance } from './sortByDistance';
import { spawnNewBlocks } from './spawnNewBlocks';

import type { Grid } from './types';
import type { FederatedPointerEvent } from 'pixi.js';

const getChipByGlobalCoords = (coords: {x: number; y: number}, field: Field): Chip | undefined => {
  const renderChip = field.getChipByPosition(coords);
  if (!renderChip) return undefined;

  const chip = fieldStore.getChipById(renderChip.id);
  return chip;
};

const findConnectedChips = ({ row, col }: Chip, grid: Grid) => findConnected(grid, row, col);

const dropChips = async (chips: Chip[], field: Field): Promise<void> => {
  const promises = chips.map(async (chip) => {
    const renderChip = field.getChipById(chip.id);
    if (!renderChip) return;
    await moveChipOnGrid(chip, renderChip);
  });

  await Promise.all(promises);
};

export const onFieldClick = async (e: FederatedPointerEvent, field: Field) => {
  const chip = getChipByGlobalCoords({ x: e.globalX, y: e.globalY }, field);
  if (!chip) return;

  const grid = fieldStore.getGrid();
  const connectedChips = findConnectedChips(chip, grid);
  if (connectedChips.length < 3) return;

  const { blockContainer } = field;
  const sortedBlocks = sortByDistance(connectedChips, chip);
  const displayBlocks = blockContainer.children as BlockView[];

  await destroyBlocks(sortedBlocks, displayBlocks, field);

  const movedChips = fieldStore.gravityGrid();
  console.log(movedChips);

  await dropChips(movedChips, field);
  const newBlocks = fieldStore.fill();
  await spawnNewBlocks(newBlocks, blockContainer, true);

  const points = connectedChips.length;
  blastGameStore.update(points);
};
