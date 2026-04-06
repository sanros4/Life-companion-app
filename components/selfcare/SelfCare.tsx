'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const categories = [
  {
    name: 'Body',
    icon: '🛁',
    color: '#f472b6',
    defaults: ['Drink 8 glasses of water 💧', 'Take a shower 🚿', 'Stretch for 10 mins 🧘', 'Go for a walk 🚶'],
  },
  {
    name: 'Mind',
    icon: '🧠',
    color: '#a78bfa',
    defaults: ['Meditate for 5 mins 🌸', 'Read a book 📚', 'No phone for 1 hour 📵', 'Write in journal ✍️'],
  },
  {
    name: 'Soul',
    icon: '✨',
    color: '#fbbf24',
    defaults: ['Call a friend 📞', 'Do something creative 🎨', 'Watch comfort show 🎬', 'Cook a nice meal 🍳'],
  },
  {
    name: 'Sleep',
    icon: '😴',
    color: '#60a5fa',
    defaults: ['Sleep by 10pm 🌙', 'No screens 1hr before bed 📱', 'Drink chamomile tea 🍵', 'Read before sleep 📖'],
  },
];

export default function SelfCare({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [tasks, setTasks]       = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Body');
  const [custom, setCustom]     = useState('');
  const [loading, setLoading]   = useState(true);
  const today = new Date().toISOString().split('T')[0];
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    fetch('/api/selfcare')
      .then(r => r.json())
      .then(d => { if (d.data) setTasks(d.data); setLoading(false); });
  }, []);

  const addTask = async (task: string, category: string) => {
    const already = tasks.find(t => t.task === task && t.category === category);
    if (already) return;
    const res = await fetch('/api/selfcare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, category, date: today }),
    });
    const d = await res.json();
    if (d.data) setTasks(t => [...t, d.data]);
  };

  const toggle = async (id: string, completed: boolean) => {
    await fetch('/api/selfcare', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    });
    setTasks(t => t.map(x => x._id === id ? { ...x, completed: !x.completed } : x));
  };

  const remove = async (id: string) => {
    await fetch('/api/selfcare', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTasks(t => t.filter(x => x._id !== id));
  };

  const addCustom = async () => {
    if (!custom.trim()) return;
    await addTask(custom, activeTab);
    setCustom('');
  };

  const activeCat = categories.find(c => c.name === activeTab)!;
  const tabTasks  = tasks.filter(t => t.category === activeTab);
  const completed = tasks.filter(t => t.completed).length;
  const total     = tasks.length;
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0;

  const inp = { background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }} className="max-w-md mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack}
          style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text }}
          className="rounded-xl px-3 py-2 text-sm font-bold">← Back</button>
        <div>
          <p style={{ color: colors.text }} className="font-pixel text-[9px]">🛁 SELF CARE</p>
          <p style={{ color: colors.muted }} className="text-[10px] font-semibold mt-0.5">{todayLabel}</p>
        </div>
      </div>

      {/* Progress Card */}
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <p style={{ color: colors.text }} className="text-sm font-bold">Today's Progress 💖</p>
          <p style={{ color: colors.accent }} className="font-pixel text-[9px]">{completed}/{total}</p>
        </div>
        <div style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
          className="rounded-full h-3 overflow-hidden">
          <div style={{ width: `${percent}%`, background: colors.accent }}
            className="h-full rounded-full transition-all duration-500" />
        </div>
        <p style={{ color: colors.muted }} className="text-[10px] font-semibold mt-1.5 text-right">
          {percent}% complete {percent === 100 ? '🎉' : percent >= 50 ? '✨' : '💪'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {categories.map(cat => (
          <button key={cat.name} onClick={() => setActiveTab(cat.name)}
            style={{
              background: activeTab === cat.name ? cat.color + '20' : colors.card,
              border: `2px solid ${activeTab === cat.name ? cat.color : colors.border}`,
              color: colors.text,
            }}
            className="rounded-xl py-2 flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95">
            <span className="text-lg">{cat.icon}</span>
            <span className="text-[8px] font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Quick Add Defaults */}
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-2xl p-4 mb-4 shadow-md">
        <p style={{ color: colors.text }} className="font-pixel text-[8px] mb-3">
          {activeCat.icon} QUICK ADD
        </p>
        <div className="flex flex-col gap-2">
          {activeCat.defaults.map(d => {
            const added = tasks.find(t => t.task === d && t.category === activeTab);
            return (
              <button key={d} onClick={() => addTask(d, activeTab)}
                style={{
                  background: added ? colors.pixel : colors.bg,
                  border: `1.5px solid ${added ? colors.accent : colors.border}`,
                  color: colors.text,
                }}
                className="rounded-xl px-3 py-2.5 text-xs font-semibold text-left flex justify-between items-center hover:scale-[1.01] transition-all">
                <span>{d}</span>
                <span>{added ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Task */}
        <div className="flex gap-2 mt-3">
          <input value={custom} onChange={e => setCustom(e.target.value)}
            placeholder="Add custom task... 🌸"
            style={inp} className="rounded-xl px-3 py-2 text-xs font-semibold outline-none flex-1"
            onKeyDown={e => e.key === 'Enter' && addCustom()} />
          <button onClick={addCustom}
            style={{ background: colors.accent }}
            className="px-3 py-2 rounded-xl text-white font-bold text-sm">+</button>
        </div>
      </div>

      {/* Today's Tasks */}
      <p style={{ color: colors.text }} className="font-pixel text-[8px] mb-3">
        📋 TODAY'S LIST
      </p>

      {loading ? (
        <p style={{ color: colors.muted }} className="text-center text-sm font-semibold py-6">Loading... 🌸</p>
      ) : tabTasks.length === 0 ? (
        <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
          className="rounded-2xl p-6 text-center shadow-sm">
          <p className="text-3xl mb-2">{activeCat.icon}</p>
          <p style={{ color: colors.muted }} className="text-xs font-semibold">
            No {activeTab} tasks yet!<br />Add some from above 💕
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {tabTasks.map(task => (
            <div key={task._id}
              style={{
                background: colors.card,
                border: `2px solid ${task.completed ? colors.accent : colors.border}`,
              }}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm hover:-translate-y-0.5 transition-transform">
              <button onClick={() => toggle(task._id, task.completed)}
                style={{
                  background: task.completed ? colors.accent : 'transparent',
                  border: `2px solid ${colors.accent}`,
                }}
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white transition-all">
                {task.completed ? '✓' : ''}
              </button>
              <p style={{
                color: colors.text,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              }}
                className="flex-1 text-xs font-semibold">{task.task}</p>
              <button onClick={() => remove(task._id)}
                style={{ color: colors.muted }}
                className="text-sm hover:text-rose-400 transition-colors">🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Motivational footer */}
      {percent === 100 && (
        <div style={{ background: colors.pixel, border: `2px solid ${colors.accent}` }}
          className="rounded-2xl p-4 mt-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p style={{ color: colors.text }} className="font-pixel text-[8px]">ALL DONE!</p>
          <p style={{ color: colors.muted }} className="text-xs font-semibold mt-1">
            You took amazing care of yourself today 💖
          </p>
        </div>
      )}
    </div>
  );
}
