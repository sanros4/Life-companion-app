'use client';
import { useState } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

export default function LoginForm({ onLogin, onSwitch }: { onLogin: (u: any) => void, onSwitch: () => void }) {
  const { colors } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) onLogin(data.user);
    else setError(data.error || 'Login failed');
  };

  const inp = { background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text };

  return (
    <div style={{ background: `linear-gradient(135deg,${colors.bg},${colors.bg2})`, minHeight: '100vh' }}
      className="flex items-center justify-center">
      <div style={{ background: colors.card, border: `2px solid ${colors.border}` }}
        className="rounded-3xl p-8 w-80 shadow-xl text-center">
        <div className="text-4xl mb-2">🌸</div>
        <p style={{ color: colors.text }} className="font-pixel text-[9px] mb-1">WELCOME BACK</p>
        <p style={{ color: colors.muted }} className="text-xs mb-6 font-semibold">Login to your cozy space 💕</p>

        <div className="flex flex-col gap-3 mb-4">
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={inp} className="rounded-xl px-4 py-3 text-sm font-semibold outline-none w-full" />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={inp} className="rounded-xl px-4 py-3 text-sm font-semibold outline-none w-full" />
        </div>

        {error && <p className="text-rose-500 text-xs font-bold mb-3">{error}</p>}

        <button onClick={submit} disabled={loading}
          style={{ background: colors.accent }}
          className="w-full py-3 rounded-2xl text-white font-extrabold text-sm hover:opacity-85 transition-opacity mb-3">
          {loading ? '✨ Logging in...' : 'Login 💖'}
        </button>

        <p style={{ color: colors.muted }} className="text-xs font-semibold">
          New here?{' '}
          <span onClick={onSwitch} style={{ color: colors.accent }} className="cursor-pointer font-bold hover:underline">
            Sign up!
          </span>
        </p>
      </div>
    </div>
  );
}
