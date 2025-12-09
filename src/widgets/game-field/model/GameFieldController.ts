import EventEmitter from 'eventemitter3';
import { FederatedPointerEvent, type Size } from 'pixi.js';

import { type Breakpoint } from '@/shared';

import { FieldStore } from './FieldStore';
import {
  createRenderChip,
  animateSpawnBlocks,
  findConnected,
  moveChipOnGrid,
  sortByDistance,
  type SpawnAnimation,
} from '../lib';
import { ChipKind, ChipPower } from '../types';
import { Field } from '../ui/Field';
import { type RenderChip } from '../ui/RenderChip';

import type { Chip } from '../lib/entities/Chip';

type FieldOptions = {
  rows: number;
  cols: number;
  uniqueChipsCount: number;
};

type EventTypes = {
  chipClick: (id: string) => void;
  destroyedChips: (chips: Chip[]) => void;
  addedChips: (chips: Chip[]) => void;
  updateField: (payload: { destroyed: Chip[]; added: Chip[] }) => void;
};

export class GameFieldController extends EventEmitter<EventTypes> {
  view = new Field();

  store = new FieldStore();

  setup(fieldOptions: FieldOptions) {
    this.store.init(fieldOptions.rows, fieldOptions.cols, fieldOptions.uniqueChipsCount);
    this.attachEvents();

    const chips = this.store.fill();
    this.view.setup(fieldOptions.rows, fieldOptions.cols);
    this.spawnNewChips(chips, 'none');
    this.view.updateHitArea();
  }

  enable() {
    this.view.enable();
  }

  disable() {
    this.view.disable();
  }

  private getRenderChips(): RenderChip[] {
    return this.view.getChips();
  }

  private getChipByGlobalCoords = (x: number, y: number): Chip | undefined => {
    const renderChip = this.view.getChipByPosition({ x, y });
    if (!renderChip) return undefined;

    const chip = this.store.getChipById(renderChip.id);
    return chip;
  };

  private findConnectedChips(chip: Chip): Chip[] {
    return findConnected(this.store.getGrid(), chip.row, chip.col);
  }

  async destroyChipsAnimation(chips: Chip[]): Promise<void> {
    const removedBlocks = this.store.removeCluster(...chips);
    const renderChips = this.getRenderChips();

    const promises: Promise<void>[] = renderChips
      .filter((block) => removedBlocks.some(({ id }) => block.id === id))
      .map((block) => block.hide());

    await Promise.all(promises);
    this.view.removeChips(...chips.map(({ id }) => id));
  }

  async dropChipsAnimation(chips: Chip[]): Promise<void> {
    const promises = chips.map(async (chip) => {
      const renderChip = this.view.getChipById(chip.id);
      if (!renderChip) return;
      await moveChipOnGrid(chip, renderChip);
    });

    await Promise.all(promises);
  }

  private async spawnNewChips(newChips: Chip[], animation: SpawnAnimation = 'none'): Promise<void> {
    const promises: Promise<void>[] = [];
    const chipMap = new Map(newChips.map((block) => [block.id, block]));

    const renderChips: RenderChip[] = newChips.map((chip) => {
      const renderChip = createRenderChip(chip);
      renderChip.setGridPosition(chip.row, chip.col);
      return renderChip;
    });

    this.view.addChips(...renderChips.reverse());

    promises.push(animateSpawnBlocks(renderChips, chipMap, animation));

    await Promise.all(promises);
  }

  private addPowerChip(targetChip: Chip, destroyedChips: Chip[]) {
    if (targetChip.kind !== ChipKind.COLOR) return;
    if (destroyedChips.length > 5) {
      const bombChip = this.store.add(
        ChipKind.POWER,
        ChipPower.BOMB,
        targetChip.row,
        targetChip.col,
      );
      if (!bombChip) return;
      this.emit('addedChips', [bombChip]);
      return bombChip;
    }
  }

  private async handleFieldClick(e: FederatedPointerEvent) {
    const chip = this.getChipByGlobalCoords(e.globalX, e.globalY);
    if (!chip) return false;

    const connectedChips = this.findConnectedChips(chip);
    if (!connectedChips.length) return false;
    this.disable();

    const sortedChips = sortByDistance(connectedChips, chip);
    this.emit('destroyedChips', sortedChips);
    await this.destroyChipsAnimation(sortedChips);

    const powerChip = this.addPowerChip(chip, sortedChips);

    if (powerChip) {
      await this.spawnNewChips([powerChip], 'fade');
    }

    const movedChips = this.store.gravityGrid();

    await this.dropChipsAnimation(movedChips);
    const newChips = this.store.fill();
    await this.spawnNewChips(newChips, 'drop');
    this.emit('addedChips', newChips);
    this.emit('updateField', { destroyed: sortedChips, added: newChips });

    this.enable();
  }

  destroy() {
    this.detachEvents();
  }

  private detachEvents() {
    this.view.off('pointertap', this.handleFieldClick, this);
  }

  private attachEvents() {
    this.view.on('pointertap', this.handleFieldClick, this);
  }

  resize(size: Size, breakpoint: Breakpoint) {
    this.view.resize(size, breakpoint);
  }
}
