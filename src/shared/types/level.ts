export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  uniqueChipsCount: number;
  grid?: number[][];
  goal: number;
  steps: number;
}
