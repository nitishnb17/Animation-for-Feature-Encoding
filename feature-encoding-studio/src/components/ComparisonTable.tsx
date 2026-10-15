import React from 'react';
import {C, F} from '../theme';
import {prog, useSec} from '../anim';

type Props = {
  header: string[];
  rows: string[][];
  start: number;
  rowDelay?: number;
  firstColWidth?: number;
  colWidth?: number;
  fontSize?: number;
  colColors?: string[];
};

/** Multi-column comparison grid; rows slide in one at a time, first column acts as the row label. */
export const ComparisonTable: React.FC<Props> = ({header, rows, start, rowDelay = 1.6, firstColWidth = 380, colWidth = 440, fontSize = 30, colColors}) => {
  const t = useSec();
  const w = (c: number) => (c === 0 ? firstColWidth : colWidth);
  const cell = (c: number): React.CSSProperties => ({
    width: w(c), padding: '18px 22px', fontSize, fontFamily: F.sans, lineHeight: 1.3,
    borderRight: c < header.length - 1 ? `1px solid ${C.line}` : 'none',
  });
  return (
    <div style={{display: 'inline-block', border: `2px solid ${C.line}`, borderRadius: 18, overflow: 'hidden', background: 'rgba(10,16,36,0.9)', boxShadow: '0 24px 70px rgba(0,0,0,0.5)'}}>
      <div style={{display: 'flex', background: C.panel2, opacity: prog(t, start, 0.6)}}>
        {header.map((h, c) => (<div key={c} style={{...cell(c), fontWeight: 800, color: colColors?.[c] ?? C.cyan}}>{h}</div>))}
      </div>
      {rows.map((row, r) => {
        const k = prog(t, start + 0.6 + r * rowDelay, 0.6);
        return (
          <div key={r} style={{display: 'flex', borderTop: `1px solid ${C.line}`, opacity: k, transform: `translateX(${(1 - k) * -50}px)`}}>
            {row.map((v, c) => (<div key={c} style={{...cell(c), color: c === 0 ? C.dim : C.text, fontWeight: c === 0 ? 700 : 500}}>{v}</div>))}
          </div>
        );
      })}
    </div>
  );
};
