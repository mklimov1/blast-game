import type { LevelConfig } from '../types/level';

export class LevelLoader {
  private static cache = new Map<number, LevelConfig>();

  static async load(levelNumber: number): Promise<LevelConfig> {
    if (this.cache.has(levelNumber)) {
      return this.cache.get(levelNumber)!;
    }

    try {
      const response = await fetch(`assets/levels/level-${levelNumber}.json`);

      if (!response.ok) {
        throw new Error(`Failed to load level ${levelNumber}: ${response.statusText}`);
      }

      const levelConfig: LevelConfig = await response.json();

      this.validateLevelConfig(levelConfig);

      this.cache.set(levelNumber, levelConfig);

      return levelConfig;
    } catch (error) {
      console.error(`Error loading level ${levelNumber}:`, error);
      throw error;
    }
  }

  private static validateLevelConfig(config: LevelConfig): void {
    if (!config.level || config.level < 1) {
      throw new Error('Invalid level number');
    }

    if (!config.rows || config.rows < 4 || config.rows > 20) {
      throw new Error('Invalid rows count: must be between 4 and 20');
    }

    if (!config.cols || config.cols < 4 || config.cols > 20) {
      throw new Error('Invalid cols count: must be between 4 and 20');
    }

    if (!config.uniqueChipsCount || config.uniqueChipsCount < 2 || config.uniqueChipsCount > 6) {
      throw new Error('Invalid uniqueChipsCount: must be between 2 and 6');
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
