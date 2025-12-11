import EventEmitter from 'eventemitter3';
import { FederatedPointerEvent, type Size } from 'pixi.js';

import {
  type Breakpoint,
  MIN_ROWS,
  MAX_ROWS,
  MIN_COLS,
  MAX_COLS,
  MIN_UNIQUE_CHIPS,
  MAX_UNIQUE_CHIPS,
  POWER_CHIP_THRESHOLD,
} from '@/shared';

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
  destroyedChips: (chips: Chip[]) => void;
  updateField: (payload: { destroyed: Chip[]; added: Chip[] }) => void;
};

export class GameFieldController extends EventEmitter<EventTypes> {
  view = new Field();

  store = new FieldStore();

  private isInitialized = false;

  private isProcessing = false;

  setup(fieldOptions: FieldOptions) {
    this.validateFieldOptions(fieldOptions);

    this.store.init(fieldOptions.rows, fieldOptions.cols, fieldOptions.uniqueChipsCount);
    this.attachEvents();

    const chips = this.store.fill();
    this.view.setup(fieldOptions.rows, fieldOptions.cols);
    this.spawnNewChips(chips, 'none');
    this.view.updateHitArea();

    this.isInitialized = true;
  }

  private validateFieldOptions(options: FieldOptions): void {
    const { rows, cols, uniqueChipsCount } = options;

    if (rows < MIN_ROWS || rows > MAX_ROWS) {
      throw new Error(`Field rows must be between ${MIN_ROWS} and ${MAX_ROWS}, got ${rows}`);
    }

    if (cols < MIN_COLS || cols > MAX_COLS) {
      throw new Error(`Field cols must be between ${MIN_COLS} and ${MAX_COLS}, got ${cols}`);
    }

    if (uniqueChipsCount < MIN_UNIQUE_CHIPS || uniqueChipsCount > MAX_UNIQUE_CHIPS) {
      throw new Error(
        `Unique chips count must be between ${MIN_UNIQUE_CHIPS} and ${MAX_UNIQUE_CHIPS}, got ${uniqueChipsCount}`,
      );
    }
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
    const removedIds = new Set(removedBlocks.map(({ id }) => id));
    const renderChips = this.getRenderChips();

    const promises: Promise<void>[] = renderChips
      .filter((block) => removedIds.has(block.id))
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
    const chipMap = new Map(newChips.map((block) => [block.id, block]));

    const renderChips: RenderChip[] = newChips.map((chip) => {
      const renderChip = createRenderChip(chip);
      renderChip.setGridPosition(chip.row, chip.col);
      return renderChip;
    });

    this.view.addChips(...renderChips.reverse());

    await animateSpawnBlocks(renderChips, chipMap, animation);
  }

  private addPowerChip(targetChip: Chip, destroyedChips: Chip[]): Chip | undefined {
    if (targetChip.kind !== ChipKind.COLOR) return;
    if (destroyedChips.length <= POWER_CHIP_THRESHOLD) return;

    const bombChip = this.store.add(ChipKind.POWER, ChipPower.BOMB, targetChip.row, targetChip.col);

    return bombChip;
  }

  private async processChipDestruction(chip: Chip): Promise<Chip[]> {
    const connectedChips = this.findConnectedChips(chip);
    if (!connectedChips.length) return [];

    const sortedChips = sortByDistance(connectedChips, chip);
    this.emit('destroyedChips', sortedChips);
    await this.destroyChipsAnimation(sortedChips);

    return sortedChips;
  }

  private async handlePowerChipSpawn(targetChip: Chip, destroyedChips: Chip[]): Promise<void> {
    const powerChip = this.addPowerChip(targetChip, destroyedChips);

    if (powerChip) {
      await this.spawnNewChips([powerChip], 'fade');
    }
  }

  private async refillField(): Promise<Chip[]> {
    const movedChips = this.store.gravityGrid();
    await this.dropChipsAnimation(movedChips);

    const newChips = this.store.fill();
    await this.spawnNewChips(newChips, 'drop');

    return newChips;
  }

  private async handleFieldClick(e: FederatedPointerEvent): Promise<void> {
    if (!this.isInitialized) return;
    if (this.isProcessing) return;

    const chip = this.getChipByGlobalCoords(e.globalX, e.globalY);
    if (!chip) return;

    try {
      this.isProcessing = true;
      this.disable();

      const destroyedChips = await this.processChipDestruction(chip);
      if (!destroyedChips.length) return;

      await this.handlePowerChipSpawn(chip, destroyedChips);
      const addedChips = await this.refillField();

      this.emit('updateField', { destroyed: destroyedChips, added: addedChips });
    } catch (error) {
      console.error('Error processing field click:', error);
    } finally {
      this.isProcessing = false;
      this.enable();
    }
  }

  destroy() {
    this.detachEvents();
    this.isInitialized = false;
    this.isProcessing = false;
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
