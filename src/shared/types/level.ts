export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  uniqueChipsCount: number;
  initialGrid?: number[][];
  goal: number;
  steps: number;
}
