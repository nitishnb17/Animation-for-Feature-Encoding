export const VIDEO = {width: 1920, height: 1080, fps: 30} as const;

export const C = {
  bg0: '#05070f',
  bg1: '#0a1024',
  panel: '#101a38',
  panel2: '#16224a',
  line: '#2a3a74',
  text: '#eaf0ff',
  dim: '#9fb0d9',
  blue: '#3d8bff',
  cyan: '#2fe3ff',
  violet: '#8b5cf6',
  magenta: '#ff3fb4',
  green: '#34f5a4',
  amber: '#ffc247',
  red: '#ff5470',
} as const;

export const F = {
  sans: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  mono: 'Consolas, "Cascadia Mono", "Courier New", monospace',
} as const;

/** Colour used whenever a colour *category* is drawn, so Red always looks Red. */
export const catColor: Record<string, string> = {
  Red: '#ff4d6d',
  Blue: '#3d8bff',
  Green: '#34f5a4',
  Yellow: '#ffd166',
};

export const BODY = {fontSize: 36, lineHeight: 1.4, color: C.text, fontFamily: F.sans} as const;
