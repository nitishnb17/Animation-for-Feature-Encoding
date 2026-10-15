import React from 'react';
import {C, F} from '../theme';
import {lerp, prog, rand, useSec} from '../anim';

export type NLPoint = {value: number; label: string; color: string};

/**
 * Number line whose axis draws itself, then points drop in. With `gapsAt`, distance brackets appear
 * between neighbouring points to show the distances a model could "see" in the codes.
 */
export const NumberLine: React.FC<{
  points: NLPoint[]; min: number; max: number; start: number; width?: number; gapsAt?: number; gapLabel?: (a: number, b: number) => string;
}> = ({points, min, max, start, width = 1400, gapsAt, gapLabel}) => {
  const t = useSec();
  const x = (v: number) => 60 + ((v - min) / (max - min)) * (width - 120);
  const axis = prog(t, start, 1.2);
  const ticks: number[] = [];
  for (let v = Math.ceil(min); v <= max; v++) ticks.push(v);
  const sorted = [...points].sort((a, b) => a.value - b.value);
  return (
    <svg width={width} height={360} style={{overflow: 'visible'}}>
      <line x1={60} y1={220} x2={60 + (width - 120) * axis} y2={220} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
      {ticks.map((v) => (
        <g key={v} opacity={axis}>
          <line x1={x(v)} y1={208} x2={x(v)} y2={232} stroke={C.cyan} strokeWidth={3} />
          <text x={x(v)} y={275} fill={C.dim} fontSize={30} fontFamily={F.mono} textAnchor="middle">{v}</text>
        </g>
      ))}
      {sorted.map((p, i) => {
        const k = prog(t, start + 1.4 + i * 0.9, 0.7);
        return (
          <g key={p.label} opacity={k} transform={`translate(0 ${(1 - k) * -60})`}>
            <circle cx={x(p.value)} cy={220} r={20} fill={p.color} style={{filter: `drop-shadow(0 0 14px ${p.color})`}} />
            <text x={x(p.value)} y={160} fill={p.color} fontSize={38} fontWeight={800} fontFamily={F.sans} textAnchor="middle">{p.label}</text>
          </g>
        );
      })}
      {gapsAt !== undefined && sorted.slice(0, -1).map((p, i) => {
        const q = sorted[i + 1];
        const k = prog(t, gapsAt + i * 1.1, 0.8);
        const x1 = x(p.value), x2 = x(q.value), mid = (x1 + x2) / 2;
        return (
          <g key={i} opacity={k}>
            <path d={`M ${x1} 300 Q ${mid} ${300 + 60 * k} ${x2} 300`} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" />
            <text x={mid} y={355} fill={C.amber} fontSize={30} fontWeight={700} fontFamily={F.mono} textAnchor="middle">
              {gapLabel ? gapLabel(p.value, q.value) : `gap = ${Math.abs(q.value - p.value)}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export type StairItem = {label: string; code: number; color: string; size: number};

/**
 * Staircase of ordered categories. `heights` are the real step heights (px). Uneven heights
 * show that evenly spaced integer codes need not reflect evenly spaced reality.
 */
export const Staircase: React.FC<{
  items: StairItem[]; heights: number[]; start: number; width?: number; showCodesAt?: number; showGapsAt?: number;
}> = ({items, heights, start, width = 1300, showCodesAt, showGapsAt}) => {
  const t = useSec();
  const n = items.length;
  const stepW = (width - 100) / n;
  const base = 520;
  return (
    <svg width={width} height={600} style={{overflow: 'visible'}}>
      {items.map((it, i) => {
        const k = prog(t, start + i * 1.0, 0.8);
        const h = heights[i] * k;
        const x0 = 50 + i * stepW;
        const objSize = it.size;
        const objY = base - h - objSize - 6;
        const code = showCodesAt === undefined ? 0 : prog(t, showCodesAt + i * 0.8, 0.6);
        return (
          <g key={it.label}>
            <rect x={x0} y={base - h} width={stepW - 14} height={h} rx={10} fill={`${it.color}33`} stroke={it.color} strokeWidth={3} />
            <rect x={x0 + (stepW - 14) / 2 - objSize / 2} y={objY} width={objSize} height={objSize} rx={objSize * 0.2}
              fill={it.color} style={{filter: `drop-shadow(0 0 16px ${it.color})`}} opacity={k} />
            <text x={x0 + (stepW - 14) / 2} y={base + 48} fill={C.text} fontSize={36} fontWeight={700} fontFamily={F.sans} textAnchor="middle" opacity={k}>{it.label}</text>
            <text x={x0 + (stepW - 14) / 2} y={base + 100} fill={it.color} fontSize={48} fontWeight={800} fontFamily={F.mono} textAnchor="middle" opacity={code}>{`= ${it.code}`}</text>
          </g>
        );
      })}
      {showGapsAt !== undefined && items.slice(0, -1).map((_, i) => {
        const k = prog(t, showGapsAt + i * 1.2, 0.8);
        const xr = 50 + (i + 1) * stepW - 7;
        const y1 = base - heights[i], y2 = base - heights[i + 1];
        return (
          <g key={i} opacity={k}>
            <line x1={xr + 10} y1={y1} x2={xr + 10} y2={y2} stroke={C.amber} strokeWidth={5} />
            <text x={xr + 24} y={(y1 + y2) / 2 + 10} fill={C.amber} fontSize={30} fontWeight={700} fontFamily={F.mono}>{`${heights[i + 1] - heights[i]}px`}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Mostly-zero matrix. Rows draw in progressively; `lit` ones are highlighted, zeros stay faint. */
export const SparseMatrix: React.FC<{
  rows: number; cols: number; cell?: number; start: number; seed?: number; rowSpeed?: number;
}> = ({rows, cols, cell = 14, start, seed = 3, rowSpeed = 0.04}) => {
  const t = useSec();
  const g = 3;
  const hot = Array.from({length: rows}, (_, r) => Math.floor(rand(r * 13 + seed) * cols));
  return (
    <svg width={cols * (cell + g)} height={rows * (cell + g)}>
      {Array.from({length: rows}, (_, r) => {
        const k = prog(t, start + r * rowSpeed, 0.4);
        return Array.from({length: cols}, (_, c) => {
          const on = hot[r] === c;
          return (
            <rect key={`${r}-${c}`} x={c * (cell + g)} y={r * (cell + g) + (1 - k) * -10} width={cell} height={cell} rx={2}
              fill={on ? C.cyan : C.line} opacity={(on ? 1 : lerp(0, 0.35, 1)) * k}
              style={on ? {filter: `drop-shadow(0 0 6px ${C.cyan})`} : undefined} />
          );
        });
      })}
    </svg>
  );
};
