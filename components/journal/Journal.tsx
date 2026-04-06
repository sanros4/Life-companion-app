'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const moods = ['😊','😢','😤','😌','🥰','😴','🤩','😔'];

export default function Journal({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<any[]>([]);
  const [writing, setWriting] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', mood: '😊' });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetch('/api/journal').then(r => r.json()).then(d => d.data && setEntries(d.data)); }, []);

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const res = await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, date: today }) });
    const d = await res.json();
    if (d.data) { setEntries(e => [d.data, ...e]); setForm({ title: '', content: '', mood: '😊' }); setWriting(false); }
  };

  const remove = async (id: string) => {
    await fetch('/api/journal', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setEntries(e => e.filter(x => x._id !== id));
  };

  const inp = { background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }} className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text }}
            className="rounded-xl px-3 py-2 text-sm font-bold">← Back</button>
          <p style={{ color: colors.text }} className="font-pixel text-[9px]">📔 JOURNAL</p>
        </div>
        <button onClick={() => setWriting(!writing)} style={{ background: colors.accent }}
          className="px-4 py-2 rounded-xl text-white text-xs font-bold">
          {writing ? '✕ Cancel' : '+ New Entry'}
        </button>
      </div>

      {writing && (
        <div style={{ background: colors.card, border: `2px solid ${colors.border}` }} className="rounded-2xl p-4 mb-5 shadow-md">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Title of your entry... 🌸" style={inp}
            className="rounded-xl px-4 py-3 text-sm font-semibold outline-none w-full mb-3" />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Write your thoughts... 💭" style={{ ...inp, resize: 'none' } as any}
            rows={5} className="rounded-xl px-4 py-3 text-sm font-semibold outline-none w-full mb-3" />
          <div className="flex gap-2 mb-3 flex-wrap">
            {moods.map(m => (
              <button key={m} onClick={() => setForm({ ...form, mood: m })}
                style={{ background: form.mood === m ? colors.pixel : 'transparent', border: `1.5px solid ${form.mood === m ? colors.accent : colors.border}` }}
                className="w-9 h-9 rounded-xl text-lg flex items-center justify-center">{m}</button>
            ))}
          </div>
          <button onClick={save} style={{ background: colors.accent }}
            className="w-full py-2.5 rounded-xl text-white font-extrabold text-sm">Save Entry 💖</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {entries.map(entry => (
          <div key={entry._id} style={{ background: colors.card, border: `2px solid ${colors.border}` }}
            className="rounded-2xl p-4 shadow-md hover:-translate-y-0.5 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{entry.mood}</span>
                <div>
                  <p style={{ color: colors.text }} className="font-bold text-sm">{entry.title}</p>
                  <p style={{ color: colors.muted }} className="text-[10px] font-semibold">{entry.date}</p>
                </div>
              </div>
              <button onClick={() => remove(entry._id)} className="text-sm hover:text-rose-400 transition-colors">🗑️</button>
            </div>
            <p style={{ color: colors.text }} className="text-xs leading-relaxed opacity-80 line-clamp-3">{entry.content}</p>
          </div>
        ))}
        {entries.length === 0 && !writing && (
          <div style={{ color: colors.muted }} className="text-center py-12 text-sm font-semibold">
            No entries yet! Start writing 📔
          </div>
        )}
      </div>
    </div>
  );
}
