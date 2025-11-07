import { Mode } from '@/shared/types/mode';

const STORAGE_KEY = 'blast_best_scores';

export class ScoreStore {
  private scores: Record<Mode, number>;

  constructor(initialValues: Record<Mode, number>) {
    const saved = this.loadFromStorage();
    this.scores = { ...initialValues, ...saved };
  }

  public get(mode: Mode): number {
    return this.scores[mode] ?? 0;
  }

  public getAll(): Record<Mode, number> {
    return { ...this.scores };
  }

  public set(mode: Mode, value: number): boolean {
    const current = this.scores[mode] ?? 0;
    if (value > current) {
      this.scores[mode] = value;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  private loadFromStorage(): Partial<Record<Mode, number>> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores));
  }
}

export const scoreStore = new ScoreStore({
  [Mode.CLASSIC]: 0,
  [Mode.TIMER]: 0,
});
