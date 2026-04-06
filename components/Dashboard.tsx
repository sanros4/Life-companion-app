'use client';
import { useTheme } from '@/src/context/ThemeContext';

const features = [
  { icon: '📅', name: 'Planner', desc: 'Organize your day', badge: '✨ today', key: 'planner' },
  { icon: '📔', name: 'Journal', desc: 'Write your heart out', badge: '💭 diary', key: 'journal' },
  { icon: '🌈', name: 'Mood Tracker', desc: 'How are you feeling?', badge: '😊 track', key: 'mood' },
  { icon: '🎵', name: 'Lofi Music', desc: 'Chill beats to relax', badge: '🎶 ready', key: 'music' },
  { icon: '⏰', name: 'Timer', desc: 'Focus & pomodoro', badge: '🍅 ready', key: 'timer' },
  { icon: '🛁', name: 'Self Care', desc: 'Daily rituals', badge: '💆 ready', key: 'selfcare' },
];

export default function Dashboard({
  onSettings, onPlanner, onJournal, onMood, onSelfCare, onTimer, onMusic
}: any) {

  const { colors } = useTheme();

  const navigate = (key: string) => {
    if (key === 'planner') onPlanner();
    if (key === 'journal') onJournal();
    if (key === 'mood') onMood();
    if (key === 'selfcare') onSelfCare();
    if (key === 'timer') onTimer();
    if (key === 'music') onMusic();
  };

  return (
    <div
      className="relative"
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bg,

        /* 📓 NOTEBOOK GRID */
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            ${colors.border},
            ${colors.border} 1px,
            transparent 1px,
            transparent 32px
          ),
          repeating-linear-gradient(
            90deg,
            ${colors.border},
            ${colors.border} 1px,
            transparent 1px,
            transparent 32px
          )
        `
      }}
    >

      {/* 📓 LEFT MARGIN LINE */}
      <div
        className="absolute left-6 top-0 h-full w-[2px] opacity-30"
        style={{ background: colors.border }}
      />

      {/* 🌸 CONTENT */}
      <div className="max-w-md mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p style={{ color: colors.text }} className="font-pixel text-[10px]">
              Hi there 💖
            </p>
            <p style={{ color: colors.muted }} className="text-xs mt-1">
              Welcome back ✨
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={onSettings}
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: `1.5px solid ${colors.border}`,
                color: colors.text,
                backdropFilter: 'blur(6px)'
              }}
              className="rounded-xl px-3 py-2"
            >
              ⚙️
            </button>

            <div
              style={{
                background: colors.pixel,
                border: `2px solid ${colors.border}`
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center"
            >
              🌸
            </div>
          </div>
        </div>

        {/* 🌸 CARDS */}
        <div className="grid grid-cols-2 gap-4">
          {features.map(f => (
            <div
              key={f.name}
              onClick={() => navigate(f.key)}
              className="rounded-2xl p-4 cursor-pointer
              hover:-translate-y-1 hover:scale-[1.03]
              transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${colors.border}`,
                boxShadow: `0 6px 15px ${colors.pixel}`
              }}
            >

              <span className="text-3xl">{f.icon}</span>

              <p style={{ color: colors.text }} className="text-[10px] mt-2 font-semibold">
                {f.name}
              </p>

              <p style={{ color: colors.muted }} className="text-[10px]">
                {f.desc}
              </p>

              <span
                style={{
                  background: colors.pixel,
                  color: colors.text
                }}
                className="text-[9px] px-2 py-1 rounded-full mt-1 inline-block"
              >
                {f.badge}
              </span>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
