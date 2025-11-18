import { Color, ChipKind, ChipPower } from './../../types';

export class Chip {
  readonly id: string;

  private _row: number;

  private _col: number;

  prevRow: number;

  prevCol: number;

  readonly kind: ChipKind;

  readonly type: Color | ChipPower;

  constructor(id: string, kind: ChipKind, type: Color | ChipPower, row: number, col: number) {
    this.id = id;
    this.kind = kind;
    this.type = type;
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
