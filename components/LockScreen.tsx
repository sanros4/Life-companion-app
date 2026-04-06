'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { colors } = useTheme();
  const [pin, setPin]       = useState('');
  const [tempPin, setTemp]  = useState('');
  const [error, setError]   = useState('');
  const [isNew, setIsNew]   = useState(false);
  const savedPin = typeof window !== 'undefined' ? localStorage.getItem('lc_pin') : null;

  useEffect(() => { setIsNew(!savedPin); }, []);

  const subtitle = isNew
    ? (tempPin ? 'Confirm your PIN 💕' : 'Choose a 4-digit PIN 🔐')
    : 'Enter your secret PIN 🔐';

  const addNum = (n: string) => {
    if (pin.length >= 4) return;
    const next = pin + n;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (isNew) {
          if (!tempPin) { setTemp(next); setPin(''); }
          else if (next === tempPin) { localStorage.setItem('lc_pin', next); onUnlock(); }
          else { setTemp(''); setPin(''); setError("PINs don't match! 🙈"); setTimeout(() => setError(''), 2000); }
        } else {
          if (next === savedPin) onUnlock();
          else { setPin(''); setError('Wrong PIN! 💔'); setTimeout(() => setError(''), 2000); }
        }
      }, 150);
    }
  };

  const s: React.CSSProperties = { background: colors.card, border: `2px solid ${colors.border}` };

  return (
    <div style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg2})`, minHeight: '100vh' }}
      className="flex items-center justify-center">
      <div style={s} className="rounded-3xl p-8 w-80 text-center shadow-xl">
        <div className="text-4xl mb-3 animate-glow">🔒</div>
        <div style={{ color: colors.text }} className="font-pixel text-[9px] mb-1">
          {isNew ? 'SET YOUR PIN' : 'WELCOME BACK'}
        </div>
        <div style={{ color: colors.muted }} className="text-xs mb-5 font-semibold">{subtitle}</div>

        {/* PIN dots */}
        <div className="flex gap-3 justify-center mb-5">
          {[0,1,2,3].map(i => (
            <div key={i} style={{ border: `2px solid ${colors.accent}`, background: i < pin.length ? colors.accent : 'transparent' }}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200" />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1','2','3','4','5','6','7','8','9'].map(n => (
            <button key={n} onClick={() => addNum(n)}
              style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}
              className="rounded-xl py-3.5 text-lg font-bold font-cute hover:scale-105 active:scale-95 transition-transform">
              {n}
            </button>
          ))}
          <div />
          <button onClick={() => addNum('0')}
            style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}
            className="rounded-xl py-3.5 text-lg font-bold font-cute hover:scale-105 active:scale-95 transition-transform">
            0
          </button>
          <button onClick={() => setPin(p => p.slice(0,-1))}
            style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.text }}
            className="rounded-xl py-3.5 text-sm font-bold font-cute hover:scale-105 active:scale-95 transition-transform">
            ⌫
          </button>
        </div>

        {error && <p className="text-rose-500 text-xs font-bold mt-3 animate-shake">{error}</p>}
      </div>
    </div>
  );
}
