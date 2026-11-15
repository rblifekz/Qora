import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Pop, Big, at, clamp, fontFamily, Notif, ease, Cam} from '../lib';

export const S7_START = 40.5;
export const S7_END = 45.0;
const T = (s: number) => at(s, S7_START);

const TYPED = 'у меня 3 дня…';

export const S7: React.FC = () => {
  const frame = useCurrentFrame();
  const boxAt = T(42.6);
  const typeStart = T(42.95);
  const chars = Math.max(0, Math.min(TYPED.length, Math.floor((frame - typeStart) / 2)));
  const fade = interpolate(frame, [T(43.9), T(44.3)], [1, 0], clamp);
  // петля: уведомление падает и встаёт ровно туда, где оно на кадре 0
  const loopP = interpolate(frame, [T(44.35), T(45.0) - 1], [0, 1], {...clamp, easing: ease});
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{opacity: fade}}>
        <Cam dur={T(S7_END)} to={1.05}>
          <Pop start={T(40.62)} style={{position: 'absolute', top: 360, left: 0, right: 0}}>
            <Big size={128}>за сколько</Big>
            <Big size={210} color={C.green}>
              дней?
            </Big>
          </Pop>
          <Pop start={T(41.54)} style={{position: 'absolute', top: 760, left: 0, right: 0}}>
            <Big size={70} color={C.gray}>
              уходит твоя зарплата
            </Big>
          </Pop>
          {frame >= boxAt && (
            <Pop start={boxAt} style={{position: 'absolute', top: 960, left: 80, right: 150}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '26px 32px',
                  borderRadius: 999,
                  background: '#1E1E24',
                  border: '2px solid #34343C',
                  fontFamily,
                }}
              >
                <div style={{width: 70, height: 70, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, #1C8C4E)`}} />
                <div style={{fontSize: 46, fontWeight: 600, color: chars ? C.white : C.gray}}>
                  {chars ? TYPED.slice(0, chars) : 'Добавить комментарий…'}
                  <span style={{opacity: cursor ? 1 : 0, color: C.green}}>|</span>
                </div>
              </div>
            </Pop>
          )}
        </Cam>
      </AbsoluteFill>
      {frame >= T(44.35) && (
        <div
          style={{
            position: 'absolute',
            top: interpolate(loopP, [0, 1], [-260, 270]),
            left: 80,
            opacity: Math.min(1, loopP * 3),
          }}
        >
          <Notif title="Зачисление +250 000 ₸" body="Заработная плата" glow={loopP} />
        </div>
      )}
    </AbsoluteFill>
  );
};
