export const createEmptyField = <T>(
  rows: number,
  cols: number,
  fill: T | null = null,
): (T | null)[][] =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => fill),
    );
