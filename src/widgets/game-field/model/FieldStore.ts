import { uid } from 'pixi.js';

import { Chip, getColorByIndex, getRandomBlockColor } from '../lib';
import { ChipKind, ChipPower, Color } from '../types';

import type { Grid } from '../types/types';

export class FieldStore {
  private grid: Grid = [];

  rows: number = 0;

  cols: number = 0;

  private uniqueChipsCount: number = 0;

  private chipMap!: Map<string, Chip>;

  init(rows: number, cols: number, uniqueChipsCount: number) {
    this.chipMap = new Map();
    this.rows = rows;
    this.cols = cols;
    this.uniqueChipsCount = uniqueChipsCount;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  getChipById(id: string): Chip | undefined {
    return this.chipMap.get(id);
  }

  getByCoords(row: number, col: number) {
    return this.grid[row][col];
  }

  add(kind: ChipKind, power: Color | ChipPower, row: number, col: number) {
    if (this.getByCoords(row, col)) return;

    const chip = new Chip(uid().toString(), kind, power, row, col);
    this.chipMap.set(chip.id, chip);
    this.grid[row][col] = chip;

    return chip;
  }

  fill(preset?: number[][]): Chip[] {
    const { uniqueChipsCount } = this;
    const newChips: Chip[] = [];

    this.grid = this.grid.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col === null) {
          const presetIndex = preset?.[rowIndex]?.[colIndex];
          const color =
            presetIndex !== undefined
              ? getColorByIndex(presetIndex)
              : getRandomBlockColor(uniqueChipsCount);
          const block = new Chip(uid().toString(), ChipKind.COLOR, color, rowIndex, colIndex);
          newChips.push(block);
          this.chipMap.set(block.id, block);
          return block;
        }
        return col;
      });
    });

    return newChips;
  }

  getGrid() {
    return this.grid;
  }

  getGridSettings() {
    return {
      rows: this.rows,
      cols: this.cols,
      uniqueChipsCount: this.uniqueChipsCount,
    };
  }

  gravityColumn(col: number): (Chip | null)[] {
    const { grid } = this;
    const columnChips = grid.map((row) => row[col]);
    const filteredColumn = columnChips.filter((chip) => chip !== null);
    const result: (Chip | null)[] = Array(columnChips.length - filteredColumn.length)
      .fill(null)
      .concat(...filteredColumn);

    result.forEach((chip, index) => {
      if (!chip) return;
      chip.row = index;
    });

    return result;
  }

  gravityGrid(): Chip[] {
    const cols = this.grid[0].length;

    for (let col = 0; col < cols; col++) {
      const chips = this.gravityColumn(col);

      chips.forEach((chip, row) => {
        this.grid[row][col] = chip;
      });
    }

    return this.grid.flat().filter((chip) => chip !== null && chip.row !== chip.prevRow) as Chip[];
  }

  removeCluster(...chips: Chip[]) {
    chips.forEach(({ row, col, id }) => {
      this.chipMap.delete(id);
      this.grid[row][col] = null;
    });

    return chips;
  }
}
