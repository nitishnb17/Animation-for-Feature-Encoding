import React from 'react';
import {C, F} from '../theme';
import {prog, useSec} from '../anim';

type Kind = 'start' | 'question' | 'answer';
type TNode = {id: string; x: number; y: number; w: number; h: number; kind: Kind; text: string; accent?: string};
type TEdge = {from: string; to: string; label?: string};

const NODES: TNode[] = [
  {id: 'start', x: 870, y: 50, w: 220, h: 70, kind: 'start', text: 'START'},
  {id: 'q1', x: 870, y: 200, w: 640, h: 110, kind: 'question', text: 'Does the category have a meaningful order?'},
  {id: 'ord', x: 330, y: 450, w: 520, h: 130, kind: 'answer', accent: C.green, text: 'Consider Ordinal Encoding'},
  {id: 'q2', x: 1230, y: 450, w: 560, h: 110, kind: 'question', text: 'Is it an input feature?'},
  {id: 'ohe', x: 880, y: 700, w: 620, h: 150, kind: 'answer', accent: C.cyan, text: 'Consider One-Hot Encoding, or another suitable categorical encoder'},
  {id: 'tgt', x: 1560, y: 700, w: 560, h: 150, kind: 'answer', accent: C.violet, text: 'If it is a target label, use a suitable target-label representation (e.g. class IDs)'},
];
const EDGES: TEdge[] = [
  {from: 'start', to: 'q1'},
  {from: 'q1', to: 'ord', label: 'YES'},
  {from: 'q1', to: 'q2', label: 'NO'},
  {from: 'q2', to: 'ohe', label: 'YES'},
  {from: 'q2', to: 'tgt', label: 'NO'},
];

/** Animated decision tree. Nodes and edges reveal in order, `step` seconds apart, beginning at `start`. */
export const DecisionTree: React.FC<{start: number; step?: number}> = ({start, step = 4}) => {
  const t = useSec();
  const order = ['start', 'q1', 'ord', 'q2', 'ohe', 'tgt'];
  const at = (id: string) => start + order.indexOf(id) * step;
  const byId = (id: string) => NODES.find((n) => n.id === id)!;
  return (
    <div style={{position: 'relative', width: 1740, height: 900}}>
      <svg width={1740} height={900} style={{position: 'absolute', left: 0, top: 0}}>
        {EDGES.map((e) => {
          const a = byId(e.from);
          const b = byId(e.to);
          const x1 = a.x, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y - b.h / 2;
          const k = prog(t, at(e.to) - 1.1, 0.9);
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <g key={e.from + e.to}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cyan} strokeWidth={4} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
              {e.label && (
                <text x={(x1 + x2) / 2 + (x2 < x1 ? -60 : 60)} y={(y1 + y2) / 2 + 10} fill={e.label === 'YES' ? C.green : C.red}
                  fontSize={34} fontWeight={800} fontFamily={F.sans} textAnchor="middle" opacity={k}>{e.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      {NODES.map((n) => {
        const k = prog(t, at(n.id), 0.7);
        const accent = n.accent ?? (n.kind === 'question' ? C.amber : C.blue);
        return (
          <div key={n.id} style={{position: 'absolute', left: n.x - n.w / 2, top: n.y - n.h / 2, width: n.w, height: n.h,
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 18,
            borderRadius: n.kind === 'start' ? 999 : 20, border: `3px solid ${accent}`, background: `${accent}22`,
            color: C.text, fontFamily: F.sans, fontSize: n.kind === 'answer' ? 30 : 33, fontWeight: 700, lineHeight: 1.25,
            boxShadow: `0 0 40px ${accent}44`, opacity: k, transform: `scale(${0.85 + 0.15 * k})`}}>
            {n.text}
          </div>
        );
      })}
    </div>
  );
};
