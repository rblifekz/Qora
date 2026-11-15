import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame} from 'remotion';
import {C, FPS, VOICE_OFFSET, Grain} from './lib';
import {Captions} from './Captions';
import {Sfx} from './Sfx';
import {S1, S1_START, S1_END} from './scenes/S1';
import {S2, S2_START, S2_END} from './scenes/S2';
import {S3, S3_START, S3_END} from './scenes/S3';
import {S4, S4_START, S4_END} from './scenes/S4';
import {S5, S5_START, S5_END} from './scenes/S5';
import {S6, S6_START, S6_END} from './scenes/S6';
import {S7, S7_START, S7_END} from './scenes/S7';

// мягкий уход в чёрное на последних кадрах сцены — чтобы стык с новой главой не «прыгал» по яркости
const FadeOut: React.FC<{dur: number; on: boolean; children: React.ReactNode}> = ({dur, on, children}) => {
  const frame = useCurrentFrame();
  const o = on ? interpolate(frame, [dur - 7, dur - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const scenes = [
  [S1, S1_START, S1_END],
  [S2, S2_START, S2_END],
  [S3, S3_START, S3_END],
  [S4, S4_START, S4_END],
  [S5, S5_START, S5_END],
  [S6, S6_START, S6_END],
  [S7, S7_START, S7_END],
] as const;

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    {scenes.map(([Comp, s, e], i) => (
      <Sequence key={i} from={Math.round(s * FPS)} durationInFrames={Math.round((e - s) * FPS)}>
        <FadeOut dur={Math.round((e - s) * FPS)} on={i >= 2 && i <= 4}>
          <Comp />
        </FadeOut>
      </Sequence>
    ))}
    <Captions />
    <Grain />
    <Sfx />
    <Sequence from={Math.round(VOICE_OFFSET * FPS)}>
      <Audio src={staticFile('voice.mp3')} />
    </Sequence>
  </AbsoluteFill>
);
