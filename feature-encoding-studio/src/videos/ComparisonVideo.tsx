import React from 'react';
import {Scene, SceneDef, SceneFC, VideoShell, totalFrames} from '../components/SceneTransition';
import {CodePanel} from '../components/CodePanel';
import {DatasetTable} from '../components/DatasetTable';
import {ComparisonTable} from '../components/ComparisonTable';
import {DecisionTree} from '../components/DecisionTree';
import {Callout, Card, Hl, Reveal} from '../components/ui';
import {C, F} from '../theme';
import {lerp, prog, useSec} from '../anim';
import {SIZE_LABEL_CODES, SIZE_OHE_COLUMNS, SIZE_OHE_ROWS, SIZE_ORDINAL_CODES, SIZE_VALUES} from '../data/examples';

const abs = (top: number, left = 0): React.CSSProperties => ({position: 'absolute', top, left});
const COLS = [C.magenta, C.cyan, C.green];
const NAMES = ['Label Encoding', 'One-Hot Encoding', 'Ordinal Encoding'];

/* ───────── S1 — Intro ───────── */
const S1: SceneFC = ({dur}) => {
  const t = useSec();
  const title = prog(t, 1, 1.4);
  return (
    <Scene dur={dur} noPad>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: F.sans, opacity: title, filter: `blur(${(1 - title) * 14}px)`, transform: `scale(${lerp(1.1, 1, title)})`}}>
        <div style={{fontSize: 40, color: C.cyan, fontWeight: 600, letterSpacing: 8 * (1 - title) + 2}}>FEATURE ENCODING</div>
        <div style={{fontSize: 100, fontWeight: 800, color: C.text, letterSpacing: -2}}>COMPLETE GUIDE</div>
      </div>
      <div style={{...abs(520, 150), display: 'flex', gap: 50}}>
        {NAMES.map((n, i) => (
          <Reveal key={n} at={4 + i * 1.4} dy={80} scale={0.9}>
            <div style={{width: 520, height: 230, borderRadius: 26, border: `4px solid ${COLS[i]}`, background: `${COLS[i]}1f`, boxShadow: `0 0 50px ${COLS[i]}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 800, fontFamily: F.sans, color: C.text, textAlign: 'center', transform: `translateY(${Math.sin(t * 1.6 + i * 2) * 10}px)`}}>{n}</div>
          </Reveal>
        ))}
      </div>
      <Reveal at={9} style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontSize: 48, color: C.text, fontFamily: F.sans}}>
        Compare them on one dataset, then learn how to <Hl>choose</Hl>.
      </Reveal>
    </Scene>
  );
};

/* ───────── S2 — Definitions & rules ───────── */
const S2: SceneFC = ({dur}) => {
  const defs = [
    {d: 'Assigns one integer code to each category.', r: 'category → a single integer'},
    {d: 'Creates one binary column per category.', r: 'category → vector with a single 1'},
    {d: 'Integer codes that follow an explicit, meaningful order.', r: 'category → its rank in the defined order'},
  ];
  return (
    <Scene dur={dur} heading="Definitions and rules">
      <div style={{...abs(0), display: 'flex', gap: 36}}>
        {defs.map((d, i) => (
          <Reveal key={i} at={1 + i * 5}>
            <Card accent={COLS[i]} style={{width: 556, height: 520}}>
              <div style={{fontSize: 40, fontWeight: 800, color: COLS[i], marginBottom: 20}}>{NAMES[i]}</div>
              <div style={{fontSize: 33, lineHeight: 1.4}}>{d.d}</div>
              <Reveal at={3 + i * 5} style={{marginTop: 30}}>
                <div style={{fontSize: 28, color: C.dim, marginBottom: 6}}>Rule</div>
                <div style={{fontSize: 32, fontWeight: 700, color: C.text}}>{d.r}</div>
              </Reveal>
            </Card>
          </Reveal>
        ))}
      </div>
      <Callout at={19} accent={C.cyan} style={{...abs(600), width: 1740}}>Next, all three are applied to the <Hl>same column</Hl>: a <Hl>Size</Hl> feature.</Callout>
    </Scene>
  );
};

/* ───────── S3 — Same dataset, three encodings ───────── */
const S3: SceneFC = ({dur}) => {
  const rows = SIZE_VALUES.map((v, i) => [v, SIZE_LABEL_CODES[i], SIZE_ORDINAL_CODES[i], ...SIZE_OHE_ROWS[i]]);
  const groupAt = (c: number) => (c === 0 ? 0 : c === 1 ? 9 : c === 2 ? 17 : 25);
  return (
    <Scene dur={dur} heading="One dataset, three encodings">
      <div style={abs(0)}>
        <DatasetTable
          columns={['Size', 'Label', 'Ordinal', ...SIZE_OHE_COLUMNS.map((c) => `is_${c}`)]}
          headerColors={[C.text, C.magenta, C.green, C.cyan, C.cyan, C.cyan]}
          rows={rows} start={1} rowDelay={1.0} colWidth={[200, 190, 200, 230, 250, 230]} fontSize={38}
          render={(r, c, tt) => {
            if (c === 0) return rows[r][0];
            const k = prog(tt, groupAt(c) + 0.3 + (c >= 3 ? (c - 3) * 0.5 : 0) + r * 0.3, 0.7);
            return <span style={{opacity: k, fontFamily: F.mono, fontWeight: 800, color: [C.text, C.magenta, C.green, C.cyan, C.cyan, C.cyan][c]}}>{rows[r][c]}</span>;
          }} />
      </div>
      <Callout at={9} until={16.5} accent={C.magenta} size={31} style={{...abs(470), width: 1740}}><Hl color={C.magenta}>Label</Hl>: scikit-learn sorts alphabetically, so Large = 0, Medium = 1, Small = 2. The codes run <Hl color={C.magenta}>opposite</Hl> to the real size order!</Callout>
      <Callout at={17} until={24.5} accent={C.green} size={31} style={{...abs(470), width: 1740}}><Hl color={C.green}>Ordinal</Hl> with an explicit order: Small = 0, Medium = 1, Large = 2. The codes follow the real order.</Callout>
      <Callout at={25} accent={C.cyan} size={31} style={{...abs(470), width: 1740}}><Hl>One-Hot</Hl>: three binary columns, one per category. Each row has exactly one 1.</Callout>
      <Reveal at={33} style={{...abs(640), width: 1740, display: 'flex', gap: 30}}>
        {[{n: 'Label', c: '1 column', col: C.magenta}, {n: 'Ordinal', c: '1 column', col: C.green}, {n: 'One-Hot', c: '3 columns (k = 3)', col: C.cyan}].map((b) => (
          <div key={b.n} style={{flex: 1, textAlign: 'center', padding: 22, borderRadius: 18, border: `3px solid ${b.col}`, background: `${b.col}1e`, fontFamily: F.sans, fontSize: 34, fontWeight: 700}}>{b.n}: <span style={{color: b.col}}>{b.c}</span></div>
        ))}
      </Reveal>
    </Scene>
  );
};

/* ───────── S4 — Columns, order, data types ───────── */
const S4: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Output shape, order, and data type">
    <ComparisonTable header={['', ...NAMES]} colColors={[C.dim, ...COLS]} start={1} rowDelay={4.5} firstColWidth={300} colWidth={480} fontSize={29}
      rows={[
        ['Resulting columns', '1 column', 'k columns (one per category)', '1 column'],
        ['Artificial order introduced?', 'Possibly: codes follow alphabetical order, not meaning', 'No ranking implied', 'Yes, by design: only valid if the order is real'],
        ['Suitable data types', 'Target labels (y)', 'Nominal input features', 'Ordered categorical features'],
      ]} />
    <Callout at={20} accent={C.amber} size={31} style={{...abs(520), width: 1740}}>"Artificial order" means a ranking the data does not truly have. Ordinal encoding is only appropriate when the ranking is <Hl color={C.amber}>real</Hl>.</Callout>
  </Scene>
);

/* ───────── S5 — Advantages and limitations ───────── */
const S5: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Strengths and weaknesses">
    <ComparisonTable header={['', ...NAMES]} colColors={[C.dim, ...COLS]} start={1} rowDelay={5} firstColWidth={250} colWidth={496} fontSize={27}
      rows={[
        ['Advantages', 'Simple, compact, useful for class labels', 'No invented order; clear; works with many models', 'Keeps a known order; few columns'],
        ['Limitations', 'May imply order for nominal inputs; codes ≠ distances', 'More columns; huge for high cardinality; unseen categories', 'Needs a valid order; may be read as equally spaced'],
      ]} />
    <Callout at={14} accent={C.cyan} size={31} style={{...abs(400), width: 1740}}>No method is best everywhere. Each trades <Hl>simplicity</Hl>, <Hl>dimensionality</Hl> and <Hl>faithfulness to the data</Hl>.</Callout>
  </Scene>
);

/* ───────── S6 — Use cases & mistakes ───────── */
const S6: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Typical uses and common mistakes">
    <ComparisonTable header={['', ...NAMES]} colColors={[C.dim, ...COLS]} start={1} rowDelay={5} firstColWidth={250} colWidth={496} fontSize={27}
      rows={[
        ['Typical use', 'Class-label IDs for y (e.g. Spam / Not Spam)', 'Nominal inputs such as color, city, product type', 'Ordered inputs such as size, rating, risk level'],
        ['Common mistake', 'Using LabelEncoder on nominal input features X', 'Fitting on all data before splitting; ignoring unseen categories', 'Guessing the order, or letting alphabetical order decide'],
      ]} />
    <Callout at={14} accent={C.red} size={31} style={{...abs(400), width: 1740}}>Fitting an encoder on <Hl color={C.red}>all</Hl> the data before the train/test split can leak information from the test set.</Callout>
  </Scene>
);

/* ───────── S7 — Python side by side ───────── */
const S7: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Python implementation">
    <div style={abs(0)}><CodePanel lines={['from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder']} start={1} fontSize={28} width={1740} title="imports" /></div>
    {[
      {lines: ['le = LabelEncoder()', 'y_enc = le.fit_transform(y)'], n: 'Target labels (y)', c: COLS[0]},
      {lines: ['ohe = OneHotEncoder(', '    handle_unknown="ignore")', 'X_enc = ohe.fit_transform(X)'], n: 'Nominal inputs (X)', c: COLS[1]},
      {lines: ['order = ["Small", "Medium", "Large"]', 'oe = OrdinalEncoder(', '    categories=[order])', 'X_enc = oe.fit_transform(X)'], n: 'Ordered inputs (X)', c: COLS[2]},
    ].map((p, i) => (
      <div key={i} style={abs(190, i * 590)}>
        <Reveal at={5 + i * 5}>
          <div style={{fontSize: 34, fontWeight: 800, color: p.c, marginBottom: 12, fontFamily: F.sans}}>{p.n}</div>
        </Reveal>
        <div style={{marginTop: 4}}><CodePanel lines={p.lines} start={6 + i * 5} lineDelay={1} fontSize={24} width={560} title={['label', 'one-hot', 'ordinal'][i]} /></div>
      </div>
    ))}
    <Callout at={22} accent={C.cyan} size={30} style={{...abs(560), width: 1740}}><Hl>y</Hl> = target labels, <Hl>X</Hl> = input features (a 2-D array: rows × features). <Hl>le</Hl> expects a 1-D list of labels.</Callout>
    <Callout at={28} accent={C.amber} size={30} style={{...abs(690), width: 1740}}>Fit on the training data, then reuse the same fitted encoder with <Hl color={C.amber}>transform()</Hl> on validation and test data.</Callout>
  </Scene>
);

/* ───────── S8 — Model-dependent considerations ───────── */
const S8: SceneFC = ({dur}) => {
  const items = [
    {t: 'Linear and distance-based models', b: 'Read numeric codes as magnitudes. Integer codes on nominal inputs can mislead them.', c: C.red},
    {t: 'Tree-based models', b: 'Split on thresholds, so they may cope better with integer codes, but it is not guaranteed.', c: C.amber},
    {t: 'Native categorical support', b: 'Some implementations accept categorical columns directly, so manual encoding may be unnecessary.', c: C.green},
  ];
  return (
    <Scene dur={dur} heading="It depends on the model">
      <div style={{...abs(0), display: 'flex', gap: 36}}>
        {items.map((it, i) => (
          <Reveal key={it.t} at={1 + i * 4.5}>
            <Card accent={it.c} style={{width: 556, height: 430}}>
              <div style={{fontSize: 38, fontWeight: 800, color: it.c, marginBottom: 18}}>{it.t}</div>
              <div style={{fontSize: 32, lineHeight: 1.4}}>{it.b}</div>
            </Card>
          </Reveal>
        ))}
      </div>
      <Callout at={16} accent={C.cyan} style={{...abs(520), width: 1740}}>Always check results with <Hl>cross-validation</Hl>; encoding is part of the model design.</Callout>
    </Scene>
  );
};

/* ───────── S9 — Decision tree ───────── */
const S9: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Decision guide">
    <div style={abs(0, 0)}><DecisionTree start={1} step={4.2} /></div>
    <Callout at={30} accent={C.amber} size={30} style={{...abs(10, 0), width: 480}}>General guidelines, <Hl color={C.amber}>not universal rules</Hl>. Some models support categorical inputs directly, and other encoders may suit a dataset better.</Callout>
  </Scene>
);

/* ───────── S10 — Final table ───────── */
const S10: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Final comparison">
    <ComparisonTable header={['Property', 'Label Encoding', 'One-Hot Encoding', 'Ordinal Encoding']} colColors={[C.text, ...COLS]} start={1} rowDelay={4.2} firstColWidth={360} colWidth={460} fontSize={29}
      rows={[
        ['Integer codes', 'Yes', 'No single integer code per category', 'Yes'],
        ['Binary columns', 'No', 'Yes', 'No'],
        ['Preserves explicit order', 'Not inherently', 'No ordinal order implied', 'Yes'],
        ['Typical use', 'Class-label IDs', 'Nominal input features', 'Ordered categorical features'],
      ]} />
    <Callout at={22} accent={C.cyan} size={31} style={{...abs(560), width: 1740}}>The exact choice depends on <Hl>feature meaning</Hl>, <Hl>model behavior</Hl> and <Hl>dataset characteristics</Hl>.</Callout>
  </Scene>
);

/* ───────── S11 — Summary ───────── */
const S11: SceneFC = ({dur}) => {
  const t = useSec();
  const parts = [
    {n: 'Label', l: 'IDs for target labels (y)', c: COLS[0]},
    {n: 'One-Hot', l: 'One column per nominal category', c: COLS[1]},
    {n: 'Ordinal', l: 'Order preserved, distance not guaranteed', c: COLS[2]},
  ];
  return (
    <Scene dur={dur} heading="Remember">
      <div style={{...abs(20), display: 'flex', gap: 40}}>
        {parts.map((p, i) => (
          <Reveal key={p.n} at={1 + i * 2.5} scale={0.9}>
            <div style={{width: 550, height: 330, padding: 30, borderRadius: 26, border: `4px solid ${p.c}`, background: `${p.c}1f`, boxShadow: `0 0 ${40 + 10 * Math.sin(t * 2 + i)}px ${p.c}55`, fontFamily: F.sans, textAlign: 'center'}}>
              <div style={{fontSize: 66, fontWeight: 800, color: p.c}}>{p.n}</div>
              <div style={{fontSize: 38, marginTop: 24, lineHeight: 1.35}}>{p.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal at={10} style={{...abs(450), width: 1740, textAlign: 'center', fontSize: 56, fontWeight: 800, fontFamily: F.sans}}>
        Match the encoding to the <span style={{color: C.cyan}}>meaning</span> of the feature.
      </Reveal>
    </Scene>
  );
};

export const comparisonScenes: SceneDef[] = [
  {name: 'intro', dur: 14, Comp: S1},
  {name: 'definitions', dur: 30, Comp: S2},
  {name: 'same-dataset', dur: 44, Comp: S3},
  {name: 'shape-order-type', dur: 36, Comp: S4},
  {name: 'strengths-weaknesses', dur: 34, Comp: S5},
  {name: 'uses-mistakes', dur: 34, Comp: S6},
  {name: 'python', dur: 36, Comp: S7},
  {name: 'model-dependent', dur: 26, Comp: S8},
  {name: 'decision-tree', dur: 46, Comp: S9},
  {name: 'final-table', dur: 36, Comp: S10},
  {name: 'summary', dur: 22, Comp: S11},
];
export const comparisonFrames = totalFrames(comparisonScenes);
export const ComparisonVideo: React.FC = () => <VideoShell scenes={comparisonScenes} label="Feature Encoding · Complete Guide" />;
