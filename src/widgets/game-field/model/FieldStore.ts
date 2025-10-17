import { uid } from 'pixi.js';

import { Chip, getRandomBlockColor } from '../lib';

import type { Grid } from '../types/types';

export class FieldStore {
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

  gravityColumn(col: number): (Chip|null)[] {
    const { grid } = this;
    const columnChips = grid.map(row => row[col]);
    const filteredColmun = columnChips.filter(chip => chip !== null);
    const result: (Chip|null)[] = Array(columnChips.length - filteredColmun.length)
      .fill(null)
      .concat(...filteredColmun);

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

    return this.grid.flat().filter((chip) =>
      chip !== null && chip.row !== chip.prevRow) as Chip[];
  }

  removeCluster(...chips: Chip[]) {
    chips.forEach(({ row, col, id }) => {
      this.chipMap.delete(id);
      this.grid[row][col] = null;
    });

    return chips;
  }
}
