import { randomInt } from './randomInt';
import {
  MAX_COLS,
  MAX_ROWS,
  MIN_COLS,
  MIN_ROWS,
  MAX_UNIQUE_CHIPS,
  MIN_UNIQUE_CHIPS,
} from '../config/fieldConfig';

import type { LevelConfig } from '../types/level';

const calcUniqueChipsCount = (rows: number): number => {
  if (rows <= 8) return randomInt(MIN_UNIQUE_CHIPS, 3);
  if (rows <= 12) return randomInt(3, 4);
  if (rows <= 16) return randomInt(4, 5);
  return randomInt(5, MAX_UNIQUE_CHIPS);
};

const calcSteps = (level: number): number => {
  return 18 + level * 2;
};

const calcGoal = (rows: number, cols: number, uniqueChipsCount: number, steps: number): number => {
  const fieldSize = rows * cols;
  const basePerStep = 5;
  const fieldBonus = (fieldSize - 36) * 0.05;
  const typePenalty = (uniqueChipsCount - 3) * 0.3;
  const perStep = Math.max(basePerStep + fieldBonus - typePenalty, 4);

  return Math.floor(steps * perStep);
};

export const generateLevelConfig = (level: number): LevelConfig => {
  const rows = randomInt(MIN_ROWS, MAX_ROWS);
  const minCols = Math.max(rows - 3, MIN_COLS);
  const maxCols = Math.min(rows + 3, MAX_COLS);
  const cols = randomInt(minCols, maxCols);
  const uniqueChipsCount = calcUniqueChipsCount(rows);
  const steps = calcSteps(level);
  const goal = calcGoal(rows, cols, uniqueChipsCount, steps);

  return {
    level,
    rows,
    cols,
    uniqueChipsCount,
    steps,
    goal,
  };
};
