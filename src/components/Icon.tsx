import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'paw' | 'map' | 'trophy' | 'store' | 'back' | 'close' | 'camera' | 'image' | 'share' | 'plus'
  | 'check' | 'lock' | 'pin' | 'walk' | 'gear' | 'heart' | 'chat' | 'chevron' | 'flag' | 'gift'
  | 'ticket' | 'locate' | 'stop' | 'trash' | 'qr' | 'sparkle';

export function Icon({ name, size = 24, color = '#24322C', strokeWidth = 2 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  let body: React.ReactNode = null;
  switch (name) {
    case 'paw':
      body = (
        <>
          <Circle cx={6.5} cy={9} r={2.2} fill={color} />
          <Circle cx={12} cy={5.8} r={2.2} fill={color} />
          <Circle cx={17.5} cy={9} r={2.2} fill={color} />
          <Path d="M12 11c-3.2 0-5.5 4-5.5 6.2 0 2 2.2 2.8 5.5 2.8s5.5-.8 5.5-2.8C17.5 15 15.2 11 12 11z" fill={color} />
        </>
      );
      break;
    case 'map':
      body = <Path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" {...p} />;
      break;
    case 'trophy':
      body = <Path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" {...p} />;
      break;
    case 'store':
      body = <Path d="M4 9l1-5h14l1 5M4 9h16v11H4zM9 20v-6h6v6" {...p} />;
      break;
    case 'back':
      body = <Path d="M15 5l-7 7 7 7" {...p} />;
      break;
    case 'close':
      body = <Path d="M6 6l12 12M18 6L6 18" {...p} />;
      break;
    case 'camera':
      body = (
        <>
          <Path d="M4 7h4l2-3h4l2 3h4v12H4z" {...p} />
          <Circle cx={12} cy={13} r={3.5} {...p} />
        </>
      );
      break;
    case 'image':
      body = (
        <>
          <Rect x={3} y={4} width={18} height={16} rx={2} {...p} />
          <Circle cx={9} cy={10} r={2} {...p} />
          <Path d="M21 16l-5-5-9 9" {...p} />
        </>
      );
      break;
    case 'share':
      body = <Path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" {...p} />;
      break;
    case 'plus':
      body = <Path d="M12 5v14M5 12h14" {...p} />;
      break;
    case 'check':
      body = <Path d="M5 12l5 5 9-10" {...p} />;
      break;
    case 'lock':
      body = (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...p} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
        </>
      );
      break;
    case 'pin':
      body = (
        <>
          <Path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" {...p} />
          <Circle cx={12} cy={9.5} r={2.5} {...p} />
        </>
      );
      break;
    case 'walk':
      body = (
        <>
          <Circle cx={13} cy={4} r={2} {...p} />
          <Path d="M10.5 8.5L8 14h4l1 7M10.5 8.5l4.5 3 3 1M8.5 21l2-6" {...p} />
        </>
      );
      break;
    case 'gear':
      body = (
        <>
          <Circle cx={12} cy={12} r={3} {...p} />
          <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" {...p} />
        </>
      );
      break;
    case 'heart':
      body = <Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={color} />;
      break;
    case 'chat':
      body = <Path d="M4 5h16v11H9l-5 4z" {...p} />;
      break;
    case 'chevron':
      body = <Path d="M9 6l6 6-6 6" {...p} />;
      break;
    case 'flag':
      body = <Path d="M5 21V4M5 4h11l-2 4 2 4H5" {...p} />;
      break;
    case 'gift':
      body = <Path d="M3 8h18v5H3zM5 13v8h14v-8M12 8v13M12 8S8 3 6 6s6 2 6 2zM12 8s4-5 6-2-6 2-6 2z" {...p} />;
      break;
    case 'ticket':
      body = <Path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" {...p} />;
      break;
    case 'locate':
      body = <Path d="M20 4L4 11l7 2 2 7z" {...p} />;
      break;
    case 'stop':
      body = <Rect x={7} y={7} width={10} height={10} rx={2} fill={color} />;
      break;
    case 'trash':
      body = <Path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" {...p} />;
      break;
    case 'qr':
      body = <Path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" {...p} />;
      break;
    case 'sparkle':
      body = <Path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" {...p} />;
      break;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body}
    </Svg>
  );
}
