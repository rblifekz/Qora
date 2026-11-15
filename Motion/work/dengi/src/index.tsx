import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Video} from './Video';
import {FPS, TOTAL} from './lib';

const Root: React.FC = () => (
  <Composition id="Dengi" component={Video} durationInFrames={TOTAL * FPS} fps={FPS} width={1080} height={1920} />
);

registerRoot(Root);
