import React from 'react';
import {C, F, catColor} from '../theme';
import {prog, useSec} from '../anim';

type Cell = string | number;

type Props = {
  columns: string[];
  rows: Cell[][];
  start: number;
  rowDelay?: number;
  colWidth?: number | number[];
  fontSize?: number;
  /** Per-cell style override; receives the scene time so cells can animate. */
  cellStyle?: (r: number, c: number, t: number) => React.CSSProperties;
  /** Per-cell content override (e.g. morph a label into a number). */
  render?: (r: number, c: number, t: number) => React.ReactNode;
  headerColors?: string[];
};

/** Table that assembles row by row. Category names are tinted with their canonical colour. */
export const DatasetTable: React.FC<Props> = ({
  columns, rows, start, rowDelay = 0.7, colWidth = 240, fontSize = 34, cellStyle, render, headerColors,
}) => {
  const t = useSec();
  const w = (c: number) => (Array.isArray(colWidth) ? colWidth[c] : colWidth);
  const hk = prog(t, start, 0.6);
  const cellBase = (c: number): React.CSSProperties => ({
    width: w(c), padding: '14px 18px', textAlign: 'center', fontSize,
    fontFamily: F.sans, borderRight: c < columns.length - 1 ? `1px solid ${C.line}` : 'none',
  });
  return (
    <div style={{display: 'inline-block', border: `2px solid ${C.line}`, borderRadius: 16, overflow: 'hidden',
      background: 'rgba(10,16,36,0.88)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)'}}>
      <div style={{display: 'flex', background: C.panel2, opacity: hk}}>
        {columns.map((col, c) => (
          <div key={c} style={{...cellBase(c), fontWeight: 700, color: headerColors?.[c] ?? C.cyan}}>{col}</div>
        ))}
      </div>
      {rows.map((row, r) => {
        const k = prog(t, start + 0.5 + r * rowDelay, 0.5);
        return (
          <div key={r} style={{display: 'flex', borderTop: `1px solid ${C.line}`, opacity: k, transform: `translateX(${(1 - k) * -40}px)`}}>
            {row.map((v, c) => {
              const tint = typeof v === 'string' ? catColor[v] : undefined;
              return (
                <div key={c} style={{...cellBase(c), color: tint ?? C.text, fontWeight: tint ? 700 : 500, ...(cellStyle ? cellStyle(r, c, t) : {})}}>
                  {render ? render(r, c, t) ?? v : v}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
