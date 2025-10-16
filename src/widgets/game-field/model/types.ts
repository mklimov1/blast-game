
import type { Chip } from '../lib/entities/Chip';

export type Grid = (Chip | null)[][];

export type Position = { row: number; col: number };

export enum BlockColor {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  RED = 'RED',
}

export type TFieldOptions = {
  rows: number;
  cols: number;
  uniqueChipsCount: number;
}

export type EventTypes = {
  chipClick: (id: string) => void;
  destroyedChips: (chips: Chip[]) => void;
  addedChips: (chips: Chip[]) => void;
  updateField: (payload: {destroyed: Chip[], added: Chip[]}) => void;
}
