'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

type Mode = 'focus' | 'short' | 'long';

const modes = [
  { key: 'focus', label: '🍅 Focus',      minutes: 25 },
  { key: 'short', label: '☕ Short Break', minutes: 5  },
  { key: 'long',  label: '🌙 Long Break',  minutes: 15 },
];

const quotes = [
  "You got this! 💪",
  "Stay focused, cutie ✨",
  "One step at a time 🌸",
  "You're doing amazing 💖",
  "Keep going, superstar 🌟",
  "Breathe and focus 🍃",
];

export default function Timer({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [mode, setMode]         = useState<Mode>('focus');
  const [seconds, setSeconds]   = useState(25 * 60);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const [quote, setQuote]       = useState(quotes[0]);
  const intervalRef             = useRef<any>(null);

  const total = modes.find(m => m.key === mode)!.minutes * 60;
  const percent = ((total - seconds) / total) * 100;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(n => n + 1);
            setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setRunning(false);
    setSeconds(modes.find(x => x.key === m)!.minutes * 60);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(modes.find(m2 => m2.key === mode)!.minutes * 60);
  };

  // Circle math
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dash = circ - (percent / 100) * circ;

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }} className="max-w-md mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}
          style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text }}
          className="rounded-xl px-3 py-2 text-sm font-bold">← Back</button>
        <p style={{ color: colors.text }} className="font-pixel text-[9px]">⏰ POMODORO</p>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {modes.map(m => (
          <button key={m.key} onClick={() => switchMode(m.key as Mode)}
            style={{
              background: mode === m.key ? colors.accent : colors.card,
              border: `2px solid ${mode === m.key ? colors.accent : colors.border}`,
              color: mode === m.key ? 'white' : colors.text,
            }}
            className="rounded-xl py-2.5 text-[10px] font-bold transition-all hover:scale-105 active:scale-95">
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-3xl p-8 mb-5 shadow-md flex flex-col items-center">

        <div className="relative flex items-center justify-center mb-6" style={{ width: 200, height: 200 }}>
          {/* Background circle */}
          <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r={r} fill="none"
              stroke={colors.border} strokeWidth="8" />
            <circle cx="100" cy="100" r={r} fill="none"
              stroke={colors.accent} strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>

          {/* Time display */}
          <div className="text-center z-10">
            <p style={{ color: colors.text, fontFamily: "'Press Start 2P', monospace", fontSize: '28px' }}>
              {mins}:{secs}
            </p>
            <p style={{ color: colors.muted }} className="text-xs font-bold mt-2">
              {mode === 'focus' ? '🍅 Focus Time' : mode === 'short' ? '☕ Short Break' : '🌙 Long Break'}
            </p>
          </div>
        </div>

        {/* Quote */}
        <p style={{ color: colors.muted }} className="text-xs font-semibold text-center mb-6 italic">
          "{quote}"
        </p>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button onClick={reset}
            style={{ background: colors.bg, border: `2px solid ${colors.border}`, color: colors.text }}
            className="flex-1 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all">
            ↺ Reset
          </button>
          <button onClick={() => setRunning(r => !r)}
            style={{ background: colors.accent }}
            className="flex-1 py-3 rounded-2xl text-white font-extrabold text-sm hover:opacity-85 active:scale-95 transition-all shadow-md">
            {running ? '⏸ Pause' : seconds === 0 ? '🔄 Restart' : '▶ Start'}
          </button>
        </div>
      </div>

      {/* Sessions + Tips */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
          className="rounded-2xl p-4 text-center shadow-sm">
          <p className="text-3xl mb-1">🍅</p>
          <p style={{ color: colors.text }} className="font-pixel text-[8px]">{sessions}</p>
          <p style={{ color: colors.muted }} className="text-[10px] font-semibold mt-1">Sessions done</p>
        </div>
        <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
          className="rounded-2xl p-4 text-center shadow-sm">
          <p className="text-3xl mb-1">⏱️</p>
          <p style={{ color: colors.text }} className="font-pixel text-[8px]">{sessions * 25}m</p>
          <p style={{ color: colors.muted }} className="text-[10px] font-semibold mt-1">Focused today</p>
        </div>
      </div>

      {/* Tips */}
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-2xl p-4 shadow-sm">
        <p style={{ color: colors.text }} className="font-pixel text-[8px] mb-3">💡 TIPS</p>
        <div className="flex flex-col gap-2">
          {[
            '🍅 Work for 25 mins, then take a 5 min break',
            '☕ After 4 sessions, take a 15 min long break',
            '📵 Put your phone away during focus time',
            '💧 Drink water during your breaks!',
          ].map(tip => (
            <p key={tip} style={{ color: colors.muted }} className="text-[10px] font-semibold">{tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

