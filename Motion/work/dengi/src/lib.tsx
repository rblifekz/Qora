import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
  Easing,
} from 'remotion';
import {continueRender, delayRender, staticFile} from 'remotion';

// Manrope (SIL OFL) — локальные файлы, кириллица + казахские буквы
export const fontFamily = 'ManropeLocal';
const FONT_FILES: [string, string][] = [
  ['manrope-latin-wght-normal.woff2', 'U+0000-00FF,U+2000-206F,U+20AC,U+2122,U+2212'],
  ['manrope-latin-ext-wght-normal.woff2', 'U+0100-024F,U+20A0-20AB,U+20AD-20C0'],
  ['manrope-cyrillic-wght-normal.woff2', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'],
  ['manrope-cyrillic-ext-wght-normal.woff2', 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F'],
];
if (typeof document !== 'undefined' && !(window as any).__manrope) {
  (window as any).__manrope = true;
  const h = delayRender('Manrope');
  Promise.all(
    FONT_FILES.map(([f, range]) => {
      const ff = new FontFace(fontFamily, `url(${staticFile('fonts/' + f)}) format('woff2')`, {
        weight: '200 800',
        unicodeRange: range,
      });
      return ff.load().then((l) => document.fonts.add(l));
    }),
  ).then(() => continueRender(h));
}

export const FPS = 30;
export const VOICE_OFFSET = 0.3; // голос стартует с 0,3 с ролика
export const TOTAL = 45; // секунд

export const C = {
  bg: '#0A0A0C',
  panel: '#141418',
  card: '#1C1C22',
  white: '#F4F4F0',
  gray: '#8E8E96',
  dim: '#4A4A52',
  green: '#2BE07A',
  red: '#E5484D',
  bill1: '#3E7A58',
  bill2: '#24503A',
};

/** секунды ролика -> кадр внутри сцены, начавшейся в sceneStart */
export const at = (sec: number, sceneStart: number) =>
  Math.round((sec - sceneStart) * FPS);

export const fmt = (n: number) =>
  String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const usePop = (start: number, cfg?: {damping?: number; stiffness?: number; mass?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - start,
    fps,
    config: {damping: 13, stiffness: 190, mass: 0.55, ...cfg},
  });
};

/** появление с пружиной + (опционально) уход */
export const Pop: React.FC<{
  start: number;
  end?: number;
  from?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({start, end, from = 0.55, y = 50, style, children}) => {
  const frame = useCurrentFrame();
  const s = usePop(start);
  const out = end !== undefined ? interpolate(frame, [end, end + 6], [1, 0], clamp) : 1;
  const outY = end !== undefined ? interpolate(frame, [end, end + 6], [0, -40], clamp) : 0;
  if (frame < start) return null;
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.4) * out,
        transform: `translateY(${(1 - s) * y + outY}px) scale(${interpolate(s, [0, 1], [from, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Big: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = 150, color = C.white, style}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -size * 0.035,
      color,
      textAlign: 'center',
      textTransform: 'uppercase',
      textShadow: '0 10px 40px rgba(0,0,0,0.55)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** медленный наезд камеры на всю сцену */
export const Cam: React.FC<{dur: number; from?: number; to?: number; children: React.ReactNode}> = ({
  dur,
  from = 1,
  to = 1.06,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [from, to], clamp);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const useShake = (start: number, len = 9, amp = 18) => {
  const frame = useCurrentFrame();
  const k = frame - start;
  if (k < 0 || k > len) return {x: 0, y: 0};
  const a = amp * (1 - k / len);
  return {x: (random(`sx${frame}`) - 0.5) * 2 * a, y: (random(`sy${frame}`) - 0.5) * 2 * a};
};

export const Notif: React.FC<{
  title: string;
  body?: string;
  icon?: string;
  color?: string;
  app?: string;
  width?: number;
  compact?: boolean;
  glow?: number;
}> = ({title, body, icon = '₸', color = C.green, app = 'Банк', width = 920, compact, glow = 0}) => (
  <div
    style={{
      width,
      padding: compact ? '22px 28px' : '30px 34px',
      borderRadius: compact ? 34 : 44,
      background: 'rgba(36,36,42,0.96)',
      boxShadow: `0 30px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.09), 0 0 ${90 * glow}px ${
        24 * glow
      }px ${color}55`,
      display: 'flex',
      gap: compact ? 22 : 28,
      alignItems: 'center',
      fontFamily,
    }}
  >
    <div
      style={{
        width: compact ? 76 : 96,
        height: compact ? 76 : 96,
        flexShrink: 0,
        borderRadius: compact ? 20 : 26,
        background: color,
        display: 'grid',
        placeItems: 'center',
        fontSize: compact ? 44 : 56,
        fontWeight: 800,
        color: C.bg,
      }}
    >
      {icon}
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: C.gray,
          fontSize: compact ? 26 : 30,
          fontWeight: 600,
        }}
      >
        <span>{app}</span>
        <span>сейчас</span>
      </div>
      <div style={{color: '#fff', fontSize: compact ? 36 : 42, fontWeight: 700, marginTop: 2}}>{title}</div>
      {body && (
        <div style={{color: '#C9C9CF', fontSize: compact ? 28 : 34, fontWeight: 500}}>{body}</div>
      )}
    </div>
  </div>
);

/** условная купюра — не копия настоящих тенге */
export const Bill: React.FC<{value?: string; w?: number; style?: React.CSSProperties; bright?: number}> = ({
  value = '10 000',
  w = 560,
  style,
  bright = 1,
}) => {
  const h = w * 0.486;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.035,
        background: `linear-gradient(135deg, ${C.bill1}, ${C.bill2})`,
        border: `${w * 0.012}px solid rgba(220,255,230,0.25)`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
        filter: `brightness(${bright})`,
        fontFamily,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(60deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 14px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 18px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: w * 0.07,
          top: h * 0.18,
          width: h * 0.64,
          height: h * 0.64,
          borderRadius: '50%',
          border: `${w * 0.008}px solid rgba(220,255,230,0.45)`,
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(230,255,238,0.85)',
          fontSize: h * 0.42,
          fontWeight: 800,
        }}
      >
        ₸
      </div>
      <div
        style={{
          position: 'absolute',
          right: w * 0.07,
          bottom: h * 0.12,
          color: 'rgba(235,255,240,0.92)',
          fontSize: h * 0.24,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: 'absolute',
          right: w * 0.07,
          top: h * 0.14,
          color: 'rgba(235,255,240,0.5)',
          fontSize: h * 0.09,
          fontWeight: 700,
          letterSpacing: 4,
        }}
      >
        ТЕҢГЕ
      </div>
    </div>
  );
};

export const Phone: React.FC<{children?: React.ReactNode; w?: number; style?: React.CSSProperties}> = ({
  children,
  w = 600,
  style,
}) => (
  <div
    style={{
      width: w,
      height: w * 2.0,
      borderRadius: w * 0.15,
      background: '#0E0E12',
      border: `${w * 0.022}px solid #2A2A31`,
      boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 0 2px #000',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: w * 0.04,
        left: '50%',
        transform: 'translateX(-50%)',
        width: w * 0.3,
        height: w * 0.075,
        borderRadius: 999,
        background: '#000',
        zIndex: 5,
      }}
    />
    {children}
  </div>
);

/** зерно + виньетка поверх всего */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.09, mixBlendMode: 'overlay'}}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.9, 0.4);
