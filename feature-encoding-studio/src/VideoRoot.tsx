import React from 'react';
import {Composition} from 'remotion';
import './styles/theme.css';
import {VIDEO} from './theme';
import {LabelEncodingVideo, labelFrames} from './videos/LabelEncodingVideo';
import {OneHotEncodingVideo, oneHotFrames} from './videos/OneHotEncodingVideo';
import {OrdinalEncodingVideo, ordinalFrames} from './videos/OrdinalEncodingVideo';
import {ComparisonVideo, comparisonFrames} from './videos/ComparisonVideo';
import {DiagramNumberLine, DiagramOneHot, DiagramStaircase} from './diagrams/Diagrams';

const common = {width: VIDEO.width, height: VIDEO.height, fps: VIDEO.fps} as const;

export const VideoRoot: React.FC = () => (
  <>
    <Composition id="LabelEncoding" component={LabelEncodingVideo} durationInFrames={labelFrames} {...common} />
    <Composition id="OneHotEncoding" component={OneHotEncodingVideo} durationInFrames={oneHotFrames} {...common} />
    <Composition id="OrdinalEncoding" component={OrdinalEncodingVideo} durationInFrames={ordinalFrames} {...common} />
    <Composition id="Comparison" component={ComparisonVideo} durationInFrames={comparisonFrames} {...common} />
    <Composition id="DiagramNumberLine" component={DiagramNumberLine} durationInFrames={300} {...common} />
    <Composition id="DiagramOneHot" component={DiagramOneHot} durationInFrames={300} {...common} />
    <Composition id="DiagramStaircase" component={DiagramStaircase} durationInFrames={300} {...common} />
  </>
);
