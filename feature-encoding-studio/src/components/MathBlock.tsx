import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Renders LaTeX with KaTeX (display mode). */
export const MathBlock: React.FC<{tex: string; size?: number}> = ({tex, size = 48}) => {
  const html = katex.renderToString(tex, {displayMode: true, throwOnError: false});
  return <div style={{fontSize: size}} dangerouslySetInnerHTML={{__html: html}} />;
};
