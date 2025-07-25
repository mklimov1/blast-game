export const blockColors = ['blue', 'green', 'orange', 'purple', 'red'] as const;

export type BlockColor = typeof blockColors[number];
