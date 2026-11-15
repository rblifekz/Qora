import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {C, FPS, VOICE_OFFSET, Grain} from './lib';
import {Captions} from './Captions';
import {S1, S1_START, S1_END} from './scenes/S1';
import {S2, S2_START, S2_END} from './scenes/S2';
import {S3, S3_START, S3_END} from './scenes/S3';
import {S4, S4_START, S4_END} from './scenes/S4';
import {S5, S5_START, S5_END} from './scenes/S5';
import {S6, S6_START, S6_END} from './scenes/S6';
import {S7, S7_START, S7_END} from './scenes/S7';

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
        <Comp />
      </Sequence>
    ))}
    <Captions />
    <Grain />
    <Sequence from={Math.round(VOICE_OFFSET * FPS)}>
      <Audio src={staticFile('voice.mp3')} />
    </Sequence>
  </AbsoluteFill>
);
