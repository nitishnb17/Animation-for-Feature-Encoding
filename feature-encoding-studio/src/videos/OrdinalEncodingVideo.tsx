import React from 'react';
import {Scene, SceneDef, SceneFC, VideoShell, totalFrames} from '../components/SceneTransition';
import {CodePanel, OutputPanel} from '../components/CodePanel';
import {Staircase} from '../components/GraphAnimation';
import {Pipeline} from '../components/Pipeline';
import {AdvLimCards} from '../components/AdvLimCards';
import {Callout, Card, Chip, Hl, Mono, Reveal} from '../components/ui';
import {C, F} from '../theme';
import {lerp, prog, useSec} from '../anim';
import {ORDINAL_ALPHABETICAL, ORDINAL_ORDER} from '../data/examples';

const abs = (top: number, left = 0): React.CSSProperties => ({position: 'absolute', top, left});
const STAIR = [
  {label: 'Small', code: 0, color: C.cyan, size: 44},
  {label: 'Medium', code: 1, color: C.blue, size: 76},
  {label: 'Large', code: 2, color: C.violet, size: 108},
];

/* ───────── S1 — Introduction ───────── */
const S1: SceneFC = ({dur}) => {
  const t = useSec();
  const title = prog(t, 6, 1.4);
  return (
    <Scene dur={dur} noPad>
      {STAIR.map((s, i) => {
        const k = prog(t, 1 + i * 1.5, 1.2);
        const grow = lerp(0.2, 1, k);
        return (
          <div key={s.label} style={{...abs(560 - s.size * grow / 2, 540 + i * 320 - s.size / 2), width: s.size * grow, height: s.size * grow, borderRadius: s.size * 0.2,
            background: s.color, boxShadow: `0 0 50px ${s.color}`, opacity: k, transform: `translateY(${Math.sin(t * 1.8 + i) * 8}px)`}} />
        );
      })}
      {STAIR.map((s, i) => (
        <Reveal key={s.label} at={2.4 + i * 1.5} style={{...abs(700, 540 + i * 320 - 110), width: 220, textAlign: 'center', fontSize: 44, fontWeight: 800, color: s.color, fontFamily: F.sans}}>{s.label}</Reveal>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: F.sans, opacity: title, filter: `blur(${(1 - title) * 14}px)`, transform: `scale(${lerp(1.1, 1, title)})`}}>
        <div style={{fontSize: 40, color: C.cyan, fontWeight: 600, letterSpacing: 8 * (1 - title) + 2}}>FEATURE ENCODING</div>
        <div style={{fontSize: 108, fontWeight: 800, color: C.text, letterSpacing: -2}}>ORDINAL ENCODING</div>
      </div>
      <Reveal at={10} style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontSize: 50, color: C.text, fontFamily: F.sans}}>
        Preserve <Hl>meaningful category order</Hl>.
      </Reveal>
    </Scene>
  );
};

/* ───────── S2 — What makes a category ordinal? ───────── */
const S2: SceneFC = ({dur}) => {
  const t = useSec();
  const bars = [{l: 'Low', h: 110, c: C.cyan}, {l: 'Medium', h: 200, c: C.blue}, {l: 'High', h: 290, c: C.violet}];
  return (
    <Scene dur={dur} heading="Nominal vs ordinal">
      <Reveal at={1} style={abs(0)}>
        <Card accent={C.magenta} style={{width: 840, height: 520}}>
          <div style={{fontSize: 42, fontWeight: 800}}>Nominal</div>
          <div style={{fontSize: 30, color: C.dim, marginBottom: 30}}>names only, no order</div>
          <div style={{position: 'relative', height: 280}}>
            {['Red', 'Blue', 'Green'].map((n, i) => (
              <div key={n} style={{position: 'absolute', left: 40 + i * 245, top: 70 + Math.sin(t * 1.6 + i * 2) * 14}}><Chip label={n} size={38} /></div>
            ))}
          </div>
          <div style={{fontSize: 30, opacity: prog(t, 6, 0.8)}}>Red, Blue, Green: <Hl color={C.magenta}>no ranking</Hl></div>
        </Card>
      </Reveal>
      <Reveal at={3} style={abs(0, 900)}>
        <Card accent={C.cyan} style={{width: 840, height: 520}}>
          <div style={{fontSize: 42, fontWeight: 800}}>Ordinal</div>
          <div style={{fontSize: 30, color: C.dim, marginBottom: 10}}>a meaningful order</div>
          <svg width={780} height={330}>
            {bars.map((b, i) => {
              const k = prog(t, 5 + i * 1.2, 0.9);
              return (
                <g key={b.l}>
                  <rect x={40 + i * 250} y={290 - b.h * k} width={200} height={b.h * k} rx={12} fill={`${b.c}55`} stroke={b.c} strokeWidth={3} />
                  <text x={140 + i * 250} y={325} fill={C.text} fontSize={34} fontWeight={700} fontFamily={F.sans} textAnchor="middle">{b.l}</text>
                </g>
              );
            })}
          </svg>
        </Card>
      </Reveal>
      <Callout at={12} accent={C.cyan} style={{...abs(580), width: 1740}}><Hl>Ordinal</Hl> categories have an inherent order: Low &lt; Medium &lt; High.</Callout>
      <Callout at={18} accent={C.amber} style={{...abs(710), width: 1740}}>But the <Hl color={C.amber}>distances</Hl> between categories may not be equal or measurable.</Callout>
    </Scene>
  );
};

/* ───────── S3 — Basic ordinal mapping ───────── */
const S3: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Basic ordinal mapping">
    <div style={abs(0, 120)}><Staircase items={STAIR} heights={[110, 220, 330]} start={1} showCodesAt={8} width={1100} /></div>
    <div style={{...abs(30, 1300), width: 440, fontFamily: F.mono, fontSize: 46, fontWeight: 800, lineHeight: 1.9}}>
      {STAIR.map((s, i) => (<Reveal key={s.label} at={8 + i * 0.8}><span style={{color: s.color}}>{s.label}</span> → {s.code}</Reveal>))}
    </div>
    <Callout at={14} accent={C.cyan} style={{...abs(700), width: 1740}}>Each step up the staircase gets a larger code. The codes <Hl>preserve the chosen order</Hl>.</Callout>
  </Scene>
);

/* ───────── S4 — Order, not equal intervals ───────── */
const S4: SceneFC = ({dur}) => {
  return (
    <Scene dur={dur} heading="Order is not distance">
      <div style={abs(0, 80)}><Staircase items={STAIR} heights={[70, 150, 360]} start={0.8} showCodesAt={5} showGapsAt={9} width={1100} /></div>
      <Reveal at={6} style={{...abs(20, 1260), width: 480}}>
        <Card accent={C.cyan} style={{fontSize: 34, lineHeight: 1.5}}>
          Code gaps<br /><Mono color={C.cyan}>1 − 0 = 1</Mono><br /><Mono color={C.cyan}>2 − 1 = 1</Mono>
          <div style={{color: C.green, fontWeight: 800, marginTop: 8}}>identical</div>
        </Card>
      </Reveal>
      <Reveal at={11} style={{...abs(340, 1260), width: 480}}>
        <Card accent={C.amber} style={{fontSize: 34, lineHeight: 1.5}}>
          Real gaps<br /><Mono color={C.amber}>80 px</Mono> then <Mono color={C.amber}>210 px</Mono>
          <div style={{color: C.amber, fontWeight: 800, marginTop: 8}}>very different</div>
        </Card>
      </Reveal>
      <Callout at={15} accent={C.cyan} size={32} style={{...abs(640), width: 1740}}>Assigning Small = 0, Medium = 1, Large = 2 does <Hl>not prove</Hl> that Small→Medium equals Medium→Large in size.</Callout>
      <Callout at={22} accent={C.green} size={32} style={{...abs(765), width: 1740}}>Ordinal values preserve <Hl color={C.green}>order</Hl>, not necessarily <Hl color={C.green}>equal intervals</Hl>.</Callout>
    </Scene>
  );
};

/* ───────── S5 — Real-world examples ───────── */
const EXAMPLES: {title: string; levels: string[]; color: string}[] = [
  {title: 'Customer satisfaction', levels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'], color: C.magenta},
  {title: 'Education', levels: ['School', 'College', 'University'], color: C.blue},
  {title: 'Product size', levels: ['Small', 'Medium', 'Large'], color: C.cyan},
  {title: 'Risk category', levels: ['Low', 'Medium', 'High'], color: C.amber},
];
const S5: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Real-world ordinal data">
    <div style={{...abs(0), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, width: 1740}}>
      {EXAMPLES.map((e, i) => (
        <Reveal key={e.title} at={1 + i * 6.5}>
          <Card accent={e.color} style={{height: i === 0 ? 400 : 310, padding: 24}}>
            <div style={{fontSize: 34, fontWeight: 800, color: e.color, marginBottom: 12}}>{e.title}</div>
            {e.levels.map((l, j) => (
              <Reveal key={l} at={1.8 + i * 6.5 + j * 0.45} dy={10}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, lineHeight: 1.35, borderBottom: `1px solid ${C.line}`, padding: '2px 4px'}}>
                  <span>{l}</span><Mono color={e.color} size={28}>{j}</Mono>
                </div>
              </Reveal>
            ))}
          </Card>
        </Reveal>
      ))}
    </div>
    <Callout at={28} accent={C.green} size={32} style={{...abs(760), width: 1740}}>The order comes from the <Hl color={C.green}>domain</Hl>, not from guessing. A person must define it.</Callout>
  </Scene>
);

/* ───────── S6 — Custom ordering ───────── */
const S6: SceneFC = ({dur}) => {
  const t = useSec();
  const row = (items: string[], codes: number[], top: number, at: number, ok: boolean) => (
    <div style={{...abs(top), display: 'flex', alignItems: 'center', gap: 28}}>
      {items.map((it, i) => (
        <Reveal key={it} at={at + i * 0.9}>
          <div style={{width: 300, textAlign: 'center', padding: 18, borderRadius: 18, border: `3px solid ${ok ? C.green : C.red}`, background: `${ok ? C.green : C.red}1e`, fontFamily: F.sans}}>
            <div style={{fontSize: 42, fontWeight: 800}}>{it}</div>
            <div style={{fontSize: 46, fontFamily: F.mono, fontWeight: 800, color: ok ? C.green : C.red}}>= {codes[i]}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
  return (
    <Scene dur={dur} heading="Order is not alphabetical">
      <Reveal at={0.6} style={{...abs(0), fontSize: 34, color: C.dim, fontFamily: F.sans}}>Meaningful (domain) order:</Reveal>
      {row(ORDINAL_ORDER, [0, 1, 2], 50, 1.4, true)}
      <Reveal at={9} style={{...abs(250), fontSize: 34, color: C.dim, fontFamily: F.sans}}>Alphabetical order (sorted by letters):</Reveal>
      {row(ORDINAL_ALPHABETICAL, [0, 1, 2], 300, 9.8, false)}
      <div style={{...abs(255, 1100), fontSize: 36, color: C.red, fontWeight: 800, fontFamily: F.sans, opacity: prog(t, 14, 0.6)}}>✕ High = 0 is lower than Low = 1</div>
      <Callout at={17} accent={C.red} size={32} style={{...abs(500), width: 1740}}>Sorted alphabetically, <Hl color={C.red}>High</Hl> comes first, so it would get the <Hl color={C.red}>smallest</Hl> code. The meaning is lost.</Callout>
      <Callout at={24} accent={C.green} size={32} style={{...abs(625), width: 1740}}>Correct mapping: <Mono color={C.green} size={32}>Low = 0, Medium = 1, High = 2</Mono>.</Callout>
      <Callout at={29} accent={C.cyan} size={32} style={{...abs(750), width: 1740}}>A domain-specific order must be <Hl>defined explicitly</Hl>.</Callout>
    </Scene>
  );
};

/* ───────── S7 — Python ───────── */
const CODE = [
  'from sklearn.preprocessing import OrdinalEncoder',
  '',
  'data = [["Low"], ["High"], ["Medium"], ["Low"]]',
  '',
  'encoder = OrdinalEncoder(',
  '    categories=[["Low", "Medium", "High"]]',
  ')',
  '',
  'encoded = encoder.fit_transform(data)',
  '',
  'print(encoder.categories_)',
  'print(encoded)',
];
const S7: SceneFC = ({dur}) => {
  const delay = 1.4, start = 1.5;
  const at = (i: number) => start + i * delay;
  return (
    <Scene dur={dur} heading="Python: OrdinalEncoder">
      <div style={abs(0)}><CodePanel lines={CODE} start={start} lineDelay={delay} fontSize={25} width={1080} /></div>
      <div style={abs(0, 1130)}>
        <OutputPanel width={610} fontSize={26} lines={[
          {text: "[array(['Low', 'Medium', 'High'],", at: at(10) + 0.4, color: C.green},
          {text: '       dtype=object)]', at: at(10) + 0.4, color: C.green},
          {text: '[[0.]', at: at(11) + 0.4, color: C.cyan}, {text: ' [2.]', at: at(11) + 0.8, color: C.cyan}, {text: ' [1.]', at: at(11) + 1.2, color: C.cyan}, {text: ' [0.]]', at: at(11) + 1.6, color: C.cyan},
        ]} />
      </div>
      <Reveal at={at(8) + 0.3} style={{...abs(330, 1130), width: 610}}>
        <div style={{display: 'flex', gap: 14, fontFamily: F.sans}}>
          {['Low', 'High', 'Medium', 'Low'].map((v, i) => (<div key={i} style={{padding: '8px 14px', border: `2px solid ${C.line}`, borderRadius: 10, fontSize: 26}}>{v}</div>))}
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 10, fontFamily: F.mono, fontSize: 40, fontWeight: 800, color: C.cyan}}>
          {[0, 2, 1, 0].map((v, i) => (<div key={i} style={{width: 112, textAlign: 'center'}}>{v}</div>))}
        </div>
      </Reveal>
      <Callout at={20} accent={C.cyan} size={29} style={{...abs(650), width: 1080}}>The input is <Hl>two-dimensional</Hl>: rows × features. Here: 4 rows, 1 feature.</Callout>
      <Callout at={27} accent={C.green} size={29} style={{...abs(650, 1130), width: 610}}><Hl color={C.green}>OrdinalEncoder</Hl> is intended for categorical <Hl color={C.green}>input features</Hl>.</Callout>
      <Callout at={34} accent={C.amber} size={29} style={{...abs(790), width: 1740}}>Without <Mono color={C.amber} size={28}>categories=</Mono>, categories are sorted alphabetically (High, Low, Medium), which would break the intended order.</Callout>
    </Scene>
  );
};

/* ───────── S8 / S9 ───────── */
const S8: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Advantages and limitations">
    <AdvLimCards
      adv={['Preserves a known category order', 'Uses fewer columns than One-Hot Encoding', 'Useful for naturally ordered categories']}
      lim={['Requires a valid, predefined order', 'A model may treat codes as equally spaced', 'Not for unordered nominal categories just because a numeric mapping is convenient']}
      bulletGap={2.6} fontSize={33} />
    <Callout at={17} accent={C.cyan} size={30} style={{...abs(700), width: 1740}}>Model choice and preprocessing design matter: the same codes can be read differently by different models.</Callout>
  </Scene>
);

const S9: SceneFC = ({dur}) => {
  const t = useSec();
  return (
    <Scene dur={dur} heading="Summary">
      <div style={abs(0, 75)}>
        <Pipeline start={0.8} step={1.0} boxWidth={330} stages={[
          {label: 'Ordered Categories', color: C.magenta}, {label: 'Explicit Ranking', color: C.blue}, {label: 'Numeric Codes', color: C.cyan}, {label: 'Model Input', color: C.green}]} />
      </div>
      <Reveal at={9} scale={0.92} style={{...abs(340), width: 1740, textAlign: 'center'}}>
        <div style={{fontSize: 74, fontWeight: 800, fontFamily: F.sans, color: C.text, lineHeight: 1.2, textShadow: `0 0 ${24 + 8 * Math.sin(t * 3)}px ${C.cyan}`}}>
          Ordinal Encoding preserves <span style={{color: C.cyan}}>order</span>,<br />not necessarily <span style={{color: C.amber}}>distance</span>.
        </div>
      </Reveal>
    </Scene>
  );
};

export const ordinalScenes: SceneDef[] = [
  {name: 'intro', dur: 16, Comp: S1},
  {name: 'nominal-vs-ordinal', dur: 28, Comp: S2},
  {name: 'basic-mapping', dur: 30, Comp: S3},
  {name: 'order-not-distance', dur: 34, Comp: S4},
  {name: 'real-world', dur: 40, Comp: S5},
  {name: 'custom-order', dur: 36, Comp: S6},
  {name: 'python', dur: 46, Comp: S7},
  {name: 'adv-lim', dur: 28, Comp: S8},
  {name: 'summary', dur: 22, Comp: S9},
];
export const ordinalFrames = totalFrames(ordinalScenes);
export const OrdinalEncodingVideo: React.FC = () => <VideoShell scenes={ordinalScenes} label="Feature Encoding · Ordinal Encoding" />;
