import { BlockColor } from '../../model';

export class Chip {
  readonly id: string;

  readonly color: BlockColor;

  private _row: number;

  private _col: number;

  prevRow: number;

  prevCol: number;

  constructor(id: string, color: BlockColor, row: number, col: number) {
    this.id = id;
    this.color = color;
    this._row = row;
    this._col = col;
    this.prevRow = row;
    this.prevCol = col;
  }

  set row(value: number) {
    this.prevRow = this._row;
    this._row = value;
  }

  set col(value: number) {
    this.prevCol = this._col;
    this._col = value;
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }
}
