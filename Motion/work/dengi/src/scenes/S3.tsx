import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useTxt, TXT, LANG} from '../lang';
import {C, Pop, Big, at, clamp, fmt, fontFamily, usePop, useShake, Bill, Cam} from '../lib';
import {ChapterBg, ChapterHead} from './Chapter';

export const S3_START = 8.4;
export const S3_END = 15.4;
const T = (s: number) => at(s, S3_START);

const Tag: React.FC<{price: number; up: number}> = ({price, up}) => (
  <div
    style={{
      position: 'relative',
      width: 620,
      height: 300,
      background: '#F2EFE6',
      borderRadius: '30px 30px 30px 30px',
      clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 50,
      fontFamily,
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    }}
  >
    <div style={{position: 'absolute', left: 58, top: 128, width: 44, height: 44, borderRadius: '50%', background: C.card}} />
    <div style={{textAlign: 'right'}}>
      <div style={{fontSize: 34, fontWeight: 700, color: '#77746C', letterSpacing: 3}}>{TXT[LANG.current].tagPrice}</div>
      <div
        style={{
          fontSize: LANG.current === 'kk' ? 108 : 130,
          fontWeight: 800,
          color: up > 0.02 ? '#C8352F' : '#1A1A1A',
          letterSpacing: -5,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {fmt(price)}&nbsp;₸
      </div>
    </div>
  </div>
);

const ITEMS = ['#E9B44C', '#D9604C', '#6FB3E0', '#9BCB6B', '#C98BD9'];


export const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const tx = useTxt();
  const NAMES = tx.goods;
  const tagIn = T(9.98);
  const upP = interpolate(frame, [T(10.38), T(12.38)], [0, 1], clamp);
  const price = 1000 + Math.round(92 * upP);
  const nineAt = T(12.06);
  const shake = useShake(nineAt + 2, 8, 14);
  const basketAt = T(13.34);
  const tagS = usePop(tagIn);
  const tagOut = interpolate(frame, [basketAt - 4, basketAt + 4], [1, 0], clamp);
  const gone = [T(14.33), T(14.58), T(14.85)];

  return (
    <ChapterBg>
      <Cam dur={T(S3_END)} to={1.05}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${shake.x}px, ${shake.y}px)`}}>
          <ChapterHead n={1} title={tx.prices} titleAt={T(8.55)} />

          {/* ценник */}
          {frame >= tagIn && (
            <div
              style={{
                position: 'absolute',
                left: 230,
                top: 760,
                transform: `rotate(${(1 - tagS) * -14 - 4}deg) scale(${0.7 + 0.3 * tagS})`,
                opacity: tagS * tagOut,
              }}
            >
              <Tag price={price} up={upP} />
            </div>
          )}

          {/* +9% */}
          <Pop start={nineAt} end={basketAt - 6} from={2.2} y={0} style={{position: 'absolute', top: 1090, left: 0, right: 0}}>
            <Big size={240} color={C.red} style={{textShadow: `0 0 60px ${C.red}66`}}>
              +9%
            </Big>
            <div
              style={{
                textAlign: 'center',
                fontFamily,
                fontSize: 30,
                fontWeight: 600,
                color: C.gray,
                marginTop: 6,
              }}
            >
              {tx.source}
            </div>
          </Pop>

          {/* та же купюра — меньше покупок */}
          {frame >= basketAt && (
            <>
              <Pop start={basketAt} style={{position: 'absolute', top: 700, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
                <Bill w={420} />
              </Pop>
              <Pop start={basketAt + 4} style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>
                {ITEMS.map((c, i) => {
                  const gi = 4 - i; // исчезают с конца
                  const g = gi < gone.length ? interpolate(frame, [gone[gi], gone[gi] + 6], [1, 0], clamp) : 1;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 30,
                        background: c,
                        opacity: g < 1 ? 0.15 + g * 0.85 : 1,
                        transform: `scale(${0.6 + 0.4 * g}) translateY(${(1 - g) * 40}px)`,
                        border: g < 1 ? `4px dashed ${C.dim}` : 'none',
                        boxShadow: '0 16px 30px rgba(0,0,0,0.4)',
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily,
                        fontWeight: 800,
                        fontSize: 30,
                        color: 'rgba(10,10,12,0.8)',
                      }}
                    >
                      {g > 0.5 ? NAMES[i] : ''}
                    </div>
                  );
                })}
              </Pop>
              <Pop start={T(14.33)} style={{position: 'absolute', top: 1160, left: 0, right: 0}}>
                <Big size={(tx.fewer1 + tx.fewer2).length > 14 ? 80 : 96}>
                  {tx.fewer1} <span style={{color: C.red}}>{tx.fewer2}</span>
                </Big>
              </Pop>
            </>
          )}
        </div>
      </Cam>
    </ChapterBg>
  );
};
