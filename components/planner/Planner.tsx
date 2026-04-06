'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

export default function Planner({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState('today');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dateVal = date === 'today' ? today : date === 'tomorrow' ? tomorrow : date;

  useEffect(() => { fetch('/api/planner').then(r => r.json()).then(d => d.data && setTasks(d.data)); }, []);

  const add = async () => {
    if (!text.trim()) return;
    const res = await fetch('/api/planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, date: dateVal }) });
    const d = await res.json();
    if (d.data) { setTasks(t => [d.data, ...t]); setText(''); }
  };

  const toggle = async (id: string, completed: boolean) => {
    await fetch('/api/planner', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, completed: !completed }) });
    setTasks(t => t.map(x => x._id === id ? { ...x, completed: !x.completed } : x));
  };

  const remove = async (id: string) => {
    await fetch('/api/planner', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTasks(t => t.filter(x => x._id !== id));
  };

  const inp = { background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }} className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text }}
          className="rounded-xl px-3 py-2 text-sm font-bold">← Back</button>
        <p style={{ color: colors.text }} className="font-pixel text-[9px]">📅 PLANNER</p>
      </div>

      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }} className="rounded-2xl p-4 mb-4 shadow-md">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a task... 🌸"
          style={inp} className="rounded-xl px-4 py-3 text-sm font-semibold outline-none w-full mb-3"
          onKeyDown={e => e.key === 'Enter' && add()} />
        <div className="flex gap-2 mb-3 flex-wrap">
          {['today', 'tomorrow'].map(d => (
            <button key={d} onClick={() => setDate(d)}
              style={{ background: date === d ? colors.accent : colors.bg, color: date === d ? 'white' : colors.text, border: `1.5px solid ${colors.border}` }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize">{d}</button>
          ))}
          <input type="date" value={date !== 'today' && date !== 'tomorrow' ? date : ''}
            onChange={e => setDate(e.target.value)}
            style={{ ...inp, fontSize: '11px' }} className="rounded-xl px-2 py-1.5 font-bold" />
        </div>
        <button onClick={add} style={{ background: colors.accent }}
          className="w-full py-2.5 rounded-xl text-white font-extrabold text-sm">
          + Add Task 💖
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map(task => (
          <div key={task._id} style={{ background: colors.card, border: `2px solid ${task.completed ? colors.accent : colors.border}` }}
            className="rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <button onClick={() => toggle(task._id, task.completed)}
              style={{ background: task.completed ? colors.accent : 'transparent', border: `2px solid ${colors.accent}` }}
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white transition-all">
              {task.completed ? '✓' : ''}
            </button>
            <div className="flex-1">
              <p style={{ color: colors.text, textDecoration: task.completed ? 'line-through' : 'none' }}
                className="text-sm font-semibold">{task.text}</p>
              <p style={{ color: colors.muted }} className="text-[10px] font-semibold mt-0.5">📅 {task.date}</p>
            </div>
            <button onClick={() => remove(task._id)} style={{ color: colors.muted }}
              className="text-base hover:text-rose-400 transition-colors">🗑️</button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{ color: colors.muted }} className="text-center py-12 text-sm font-semibold">
            No tasks yet! Add one above 🌸
          </div>
        )}
      </div>
    </div>
  );
}
