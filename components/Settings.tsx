'use client';
import { useTheme } from '@/src/context/ThemeContext';

const themes = [
  { id: 'pink',     label: '🌸 Baby Pink', swatch: 'linear-gradient(135deg,#fce7f3,#f472b6)' },
  { id: 'lavender', label: '🪻 Lavender',  swatch: 'linear-gradient(135deg,#ede9fe,#a78bfa)' },
  { id: 'yellow',   label: '🌼 Sunshine',  swatch: 'linear-gradient(135deg,#fef9c3,#fbbf24)' },
];

export default function Settings({ onBack }: { onBack: () => void }) {
  const { theme, setTheme, colors } = useTheme();
  return (
    <div style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg2})`, minHeight: '100vh' }}
      className="flex items-center justify-center">
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-3xl p-7 w-72 shadow-xl">
        <p style={{ color: colors.text }} className="font-pixel text-[8px] text-center mb-5">🎨 CHOOSE THEME</p>
        <div className="flex flex-col gap-3">
          {themes.map(t => (
            <div key={t.id} onClick={() => setTheme(t.id as any)}
              style={{ background: theme === t.id ? colors.pixel : colors.bg, border: `2px solid ${theme === t.id ? colors.accent : colors.border}` }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all">
              <div style={{ background: t.swatch }} className="w-7 h-7 rounded-full border border-black/10" />
              <span style={{ color: colors.text }} className="font-bold text-sm">{t.label}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack}
          style={{ background: colors.accent }}
          className="mt-5 w-full py-3 rounded-2xl text-white font-extrabold text-sm hover:opacity-85 transition-opacity">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
