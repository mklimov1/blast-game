import { EventEmitter, uid } from 'pixi.js';

import { getRandomBlockColor } from '@/entities';

import { Chip } from './Chip';

import type { Grid } from './types';

export type FieldEvents = {
  'blocks:destroyed': (...blocks: Chip[]) => void;
  'blocks:clear': () => void;
  'blocks:added': () => void;
};

class FieldStore extends EventEmitter<FieldEvents> {
  private grid: Grid = [];

  private rows: number= 0;

  private cols: number= 0;

  private maxColors: number= 0;

  private chipMap!: Map<string, Chip>;

  init(rows: number, cols: number, maxColors: number) {
    this.chipMap = new Map();
    this.rows = rows;
    this.cols = cols;
    this.maxColors = maxColors;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  getChipById(id:string): Chip | undefined {
    return this.chipMap.get(id);
  }

  fill() {
    const { maxColors } = this;
    const newChips: Chip[] = [];

    this.grid = this.grid.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col === null) {
          const color = getRandomBlockColor(maxColors);
          const block =  new Chip(uid().toString(), color, rowIndex, colIndex);
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
      maxColors: this.maxColors,
    };
  }

  gravityColumn(col: number) {
    const { grid } = this;
    const columnChips = grid.map(row => row[col]);
    const result = Array(columnChips.length).fill(null);
    const movedChips: Chip[] = [];

    let index = columnChips.length - 1;

    for (let i = columnChips.length - 1; i >= 0; i--) {
      const chip = columnChips[i];
      if (chip !== null) {
        result[index] = chip;

        if (chip.row !== index) {
          movedChips.push(chip);
        }

        chip.row = index;
        chip.col = col;
        index--;
      }
    }

    return { result, movedChips };
  }

  gravityGrid() {
    const { grid } = this;
    const cols = grid[0].length;
    const rows = grid.length;
    const allMovedChips: Chip[] = [];

    for (let col = 0; col < cols; col++) {
      const { result, movedChips } = this.gravityColumn(col);

      for (let row = 0; row < rows; row++) {
        grid[row][col] = result[row];
      }

      allMovedChips.push(...movedChips);
    }

    return allMovedChips;
  }

  clear() {
    this.chipMap.clear();
    this.init(this.rows, this.cols, this.maxColors);
  }

  removeCluster(...chips: Chip[]) {
    chips.forEach(({ row, col, id }) => {
      this.chipMap.delete(id);
      this.grid[row][col] = null;
    });

    this.emit('blocks:destroyed', ...chips);

    return chips;
  }
}

export const fieldStore = new FieldStore();
