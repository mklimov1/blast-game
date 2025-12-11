const STORAGE_KEY = 'blast_current_level';
const DEFAULT_LEVEL = 1;

export class LevelStore {
  private currentLevel: number;

  constructor() {
    this.currentLevel = this.loadFromStorage();
  }

  public get(): number {
    return this.currentLevel;
  }

  public set(level: number): void {
    if (level < 1) {
      console.warn('Level must be >= 1, ignoring');
      return;
    }

    this.currentLevel = level;
    this.saveToStorage();
  }

  public next(): number {
    this.currentLevel += 1;
    this.saveToStorage();
    return this.currentLevel;
  }

  public reset(): void {
    this.currentLevel = DEFAULT_LEVEL;
    this.saveToStorage();
  }

  private loadFromStorage(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const level = raw ? parseInt(raw, 10) : DEFAULT_LEVEL;
      return level >= 1 ? level : DEFAULT_LEVEL;
    } catch {
      return DEFAULT_LEVEL;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, this.currentLevel.toString());
    } catch (error) {
      console.error('Failed to save level to localStorage:', error);
    }
  }
}

export const levelStore = new LevelStore();
