'use client';
import { useTheme } from '@/src/context/ThemeContext';

export default function Landing({ onEnter }: { onEnter: () => void }) {
  const { colors } = useTheme();
  return (
    <div style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg2})`, minHeight: '100vh' }}
      className="flex flex-col items-center justify-center">
      <p style={{ color: colors.text }} className="font-pixel text-xs mb-8 text-center leading-loose tracking-widest">
        ✿ Life Companion ✿<br />
        <span style={{ color: colors.muted, fontSize: '8px' }}>your cozy digital diary</span>
      </p>
      <div onClick={onEnter}
        style={{ filter: `drop-shadow(0 0 18px ${colors.accent})` }}
        className="text-7xl cursor-pointer animate-bounce2 hover:scale-110 active:scale-95 transition-transform select-none">
        🌸
      </div>
      <p style={{ color: colors.muted }} className="font-pixel text-[8px] mt-6 animate-pulse2 tracking-[4px]">
        tap to enter
      </p>
    </div>
  );
}
