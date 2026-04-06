'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const moods = [
  { emoji: '😊', label: 'Happy',   color: '#fbbf24' },
  { emoji: '😢', label: 'Sad',     color: '#60a5fa' },
  { emoji: '😤', label: 'Stressed',color: '#f87171' },
  { emoji: '😌', label: 'Calm',    color: '#34d399' },
  { emoji: '🥰', label: 'Loved',   color: '#f472b6' },
  { emoji: '😴', label: 'Tired',   color: '#a78bfa' },
  { emoji: '🤩', label: 'Excited', color: '#fb923c' },
  { emoji: '😔', label: 'Low',     color: '#94a3b8' },
];

export default function MoodTracker({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetch('/api/mood').then(r => r.json()).then(d => d.data && setHistory(d.data)); }, []);

  const save = async () => {
    if (!selected) return;
    const res = await fetch('/api/mood', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood: selected, note, date: today }) });
    const d = await res.json();
    if (d.data) { setHistory(h => [d.data, ...h]); setSaved(true); setNote(''); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }} className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text }}
          className="rounded-xl px-3 py-2 text-sm font-bold">← Back</button>
        <p style={{ color: colors.text }} className="font-pixel text-[9px]">🌈 MOOD TRACKER</p>
      </div>

      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }} className="rounded-2xl p-5 mb-5 shadow-md text-center">
        <p style={{ color: colors.text }} className="font-pixel text-[8px] mb-4">HOW ARE YOU TODAY?</p>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {moods.map(m => (
            <button key={m.emoji} onClick={() => setSelected(m.emoji)}
              style={{ background: selected === m.emoji ? m.color + '30' : colors.bg, border: `2px solid ${selected === m.emoji ? m.color : colors.border}` }}
              className="rounded-2xl py-3 flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all">
              <span className="text-2xl">{m.emoji}</span>
              <span style={{ color: colors.muted }} className="text-[9px] font-bold">{m.label}</span>
            </button>
          ))}
        </div>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note... 💭"
          style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold outline-none w-full mb-3" />
        <button onClick={save} style={{ background: colors.accent }}
          className="w-full py-2.5 rounded-xl text-white font-extrabold text-sm">
          {saved ? '✓ Saved! 💖' : 'Log Mood 🌈'}
        </button>
      </div>

      <p style={{ color: colors.text }} className="font-pixel text-[8px] mb-3">MOOD HISTORY</p>
      <div className="flex flex-col gap-3">
        {history.map(h => (
          <div key={h._id} style={{ background: colors.card, border: `2px solid ${colors.border}` }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">{h.mood}</span>
            <div className="flex-1">
              <p style={{ color: colors.muted }} className="text-[10px] font-bold">{h.date}</p>
              {h.note && <p style={{ color: colors.text }} className="text-xs font-semibold mt-0.5">{h.note}</p>}
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div style={{ color: colors.muted }} className="text-center py-8 text-sm font-semibold">No mood logs yet! 🌈</div>
        )}
      </div>
    </div>
  );
}
