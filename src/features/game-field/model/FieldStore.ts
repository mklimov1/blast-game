import { EventEmitter } from "pixi.js";

import { getRandomBlockColor } from "@/entities/lib/getRandomBlockColor";
import type { Position } from "@/widgets/game-field/model/types";

import type { Block, Grid } from "./types";

export type FieldEvents = {
  "blocks:destroyed": (...positions: Position[]) => void;
  "blocks:clear": () => void;
};

class FieldStore extends EventEmitter<FieldEvents> {
  private grid: Grid = [];

  private rows: number= 0;

  private cols: number= 0;

  private maxColors: number= 0;

  init(rows: number, cols: number, maxColors: number) {
    this.rows = rows;
    this.cols = cols;
    this.maxColors = maxColors;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  fill() {
    const { maxColors } = this;
    const newBlocks: Block[] = [];

    this.grid = this.grid.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col === null) {
          const color = getRandomBlockColor(maxColors);
          const block = { color, row: rowIndex, col: colIndex };
          newBlocks.push(block);
          return block;
        }
        return col;
      });
    });

    return newBlocks;
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

  clear() {
    this.init(this.rows, this.cols, this.maxColors);
  }

  removeCluster(...positions: Position[]) {
    const removedBlocks = positions.map(({ row, col }) => this.grid[row][col]) as Block[];

    removedBlocks.forEach(({ row, col }) => {
      this.grid[row][col] = null;
    });

    this.emit("blocks:destroyed", ...positions);

    return removedBlocks;
  }
}

export const fieldStore = new FieldStore();
