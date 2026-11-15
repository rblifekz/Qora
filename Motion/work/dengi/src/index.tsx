import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Video} from './Video';
import {FPS} from './lib';
import {DURATION} from './lang';

const Root: React.FC = () => (
  <>
    <Composition id="Dengi" component={Video} defaultProps={{lang: 'ru' as const}} durationInFrames={Math.round(DURATION.ru * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="DengiKK" component={Video} defaultProps={{lang: 'kk' as const}} durationInFrames={Math.round(DURATION.kk * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);

registerRoot(Root);
