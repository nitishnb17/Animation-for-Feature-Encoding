import React from 'react';
import {C, F} from '../theme';
import {prog, useSec} from '../anim';

const KEYWORDS = new Set(['from', 'import', 'as', 'for', 'in', 'try', 'except']);
const CONSTS = new Set(['True', 'False', 'None']);

const colorize = (line: string): React.ReactNode[] => {
  const re = /("[^"]*"|'[^']*')|(#.*$)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  const out: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line)) !== null) {
    const [tok, str, com, num, id] = m;
    let color: string = C.text;
    let style: React.CSSProperties = {};
    if (str) color = C.green;
    else if (com) { color = C.dim; style = {fontStyle: 'italic'}; }
    else if (num) color = C.amber;
    else if (id) {
      if (KEYWORDS.has(id)) color = C.magenta;
      else if (CONSTS.has(id)) color = C.amber;
      else if (line[re.lastIndex] === '(') color = /^[A-Z]/.test(id) ? C.violet : C.cyan;
      else if (/^[A-Z]/.test(id)) color = C.violet;
    }
    out.push(<span key={i++} style={{color, ...style}}>{tok}</span>);
  }
  return out;
};

type CodeProps = {
  lines: string[];
  start: number;
  lineDelay?: number;
  /** Index of the line to spotlight (or -1). */
  active?: number;
  fontSize?: number;
  width?: number;
  title?: string;
};

/** Syntax-highlighted Python that reveals line by line. */
export const CodePanel: React.FC<CodeProps> = ({lines, start, lineDelay = 1.2, active = -1, fontSize = 30, width = 1000, title = 'python'}) => {
  const t = useSec();
  return (
    <div style={{width, background: '#080d1f', border: `2px solid ${C.line}`, borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 24px 70px rgba(0,0,0,0.55)', opacity: prog(t, start - 0.3, 0.5)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: C.panel2}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (<div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />))}
        <div style={{marginLeft: 12, color: C.dim, fontFamily: F.mono, fontSize: 20}}>{title}</div>
      </div>
      <div style={{padding: '18px 0'}}>
        {lines.map((ln, i) => {
          const k = prog(t, start + i * lineDelay, 0.5);
          const isActive = i === active;
          return (
            <div key={i} style={{display: 'flex', fontFamily: F.mono, fontSize, lineHeight: 1.55, opacity: k,
              transform: `translateX(${(1 - k) * 24}px)`, background: isActive ? 'rgba(47,227,255,0.14)' : 'transparent',
              borderLeft: `5px solid ${isActive ? C.cyan : 'transparent'}`}}>
              <span style={{width: 64, textAlign: 'right', paddingRight: 22, color: C.line}}>{i + 1}</span>
              <span style={{whiteSpace: 'pre'}}>{ln === '' ? ' ' : colorize(ln)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type OutLine = {text: string; at: number; color?: string};

/** Terminal-style output panel with timed lines. */
export const OutputPanel: React.FC<{lines: OutLine[]; fontSize?: number; width?: number}> = ({lines, fontSize = 30, width = 700}) => {
  const t = useSec();
  const first = Math.min(...lines.map((l) => l.at));
  return (
    <div style={{width, background: '#050814', border: `2px solid ${C.green}66`, borderRadius: 16, overflow: 'hidden',
      boxShadow: `0 24px 70px rgba(0,0,0,0.55), 0 0 40px ${C.green}22`, opacity: prog(t, first - 0.3, 0.5)}}>
      <div style={{padding: '12px 18px', background: C.panel2, color: C.green, fontFamily: F.mono, fontSize: 20}}>output</div>
      <div style={{padding: '18px 24px'}}>
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: F.mono, fontSize, lineHeight: 1.55, whiteSpace: 'pre', color: l.color ?? C.text, opacity: prog(t, l.at, 0.5)}}>{l.text}</div>
        ))}
      </div>
    </div>
  );
};
