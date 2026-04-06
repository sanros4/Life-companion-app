'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const tracks = [
  {
    title: 'Cozy Rain',
    artist: 'Lofi Vibes',
    emoji: '🌧️',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'
  },
  {
    title: 'Sleepy Afternoon',
    artist: 'Chill Beats',
    emoji: '☁️',
    url: 'https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3'
  },
  {
    title: 'Cherry Blossom',
    artist: 'Study Lofi',
    emoji: '🌸',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Midnight Cafe',
    artist: 'Jazz Lofi',
    emoji: '🌙',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'Forest Morning',
    artist: 'Nature Beats',
    emoji: '🌿',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3'
  },
];

export default function MusicPlayer({ onBack }: { onBack: () => void }) {
  const { colors } = useTheme();
  const [current, setCurrent]   = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [volume, setVolume]     = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading]   = useState(false);
  const audioRef                = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    const audio = audioRef.current;

    audio.addEventListener('timeupdate',     () => setProgress(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended',          () => next());
    audio.addEventListener('waiting',        () => setLoading(true));
    audio.addEventListener('canplay',        () => setLoading(false));

    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = tracks[current].url;
    audioRef.current.load();
    setProgress(0); setDuration(0);
    if (playing) audioRef.current.play().catch(() => {});
  }, [current]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = tracks[current].url;
        audioRef.current.load();
      }
      try { await audioRef.current.play(); setPlaying(true); } catch {}
    }
  };

  const next = () => setCurrent(c => (c + 1) % tracks.length);
  const prev = () => setCurrent(c => (c - 1 + tracks.length) % tracks.length);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  const track = tracks[current];

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onBack}
            style={{ background: colors.card, border: `1.5px solid ${colors.border}`, color: colors.text, borderRadius: '12px', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            ← Back
          </button>
          <p style={{ color: colors.text, fontFamily: "'Press Start 2P'", fontSize: '9px' }}>🎵 LOFI MUSIC</p>
        </div>

        {/* Player Card */}
        <div style={{ background: colors.card, border: `2px solid ${colors.border}`, borderRadius: '24px', padding: '24px', marginBottom: '16px', boxShadow: `0 4px 20px ${colors.border}`, textAlign: 'center' }}>

          {/* Album Art */}
          <div style={{ width: '120px', height: '120px', background: colors.pixel, border: `3px solid ${colors.border}`, borderRadius: '20px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
            <span style={{ display: 'block', animation: playing ? 'spin 8s linear infinite' : 'none' }}>
              {track.emoji}
            </span>
          </div>

          {/* Track Info */}
          <p style={{ color: colors.text, fontFamily: "'Press Start 2P'", fontSize: '9px', marginBottom: '4px' }}>{track.title}</p>
          <p style={{ color: colors.muted, fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>{track.artist}</p>

          {/* Visualizer bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', height: '32px', marginBottom: '16px' }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                background: colors.accent,
                width: '6px',
                borderRadius: '3px',
                height: playing ? `${10 + Math.abs(Math.sin(i * 0.9)) * 20}px` : '4px',
                opacity: playing ? 0.6 + (i % 3) * 0.13 : 0.25,
                transition: 'height 0.4s ease',
                animation: playing ? `bar${i % 4} ${0.5 + (i % 3) * 0.2}s ease-in-out infinite alternate` : 'none',
              }} />
            ))}
          </div>

          {/* Progress */}
          <input type="range" min="0" max={duration || 100} value={progress}
            onChange={seek} style={{ width: '100%', accentColor: colors.accent, marginBottom: '4px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ color: colors.muted, fontSize: '10px', fontWeight: '600' }}>{fmt(progress)}</span>
            <span style={{ color: colors.muted, fontSize: '10px', fontWeight: '600' }}>{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <button onClick={prev}
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: colors.bg, border: `1.5px solid ${colors.border}`, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ⏮
            </button>
            <button onClick={togglePlay}
              style={{ width: '64px', height: '64px', borderRadius: '50%', background: colors.accent, border: 'none', fontSize: '24px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${colors.accent}60` }}>
              {loading ? '⏳' : playing ? '⏸' : '▶'}
            </button>
            <button onClick={next}
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: colors.bg, border: `1.5px solid ${colors.border}`, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ⏭
            </button>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: colors.muted }}>🔈</span>
            <input type="range" min="0" max="1" step="0.01" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              style={{ flex: 1, accentColor: colors.accent }} />
            <span style={{ color: colors.muted }}>🔊</span>
          </div>
        </div>

        {/* Playlist */}
        <p style={{ color: colors.text, fontFamily: "'Press Start 2P'", fontSize: '8px', marginBottom: '12px' }}>🎶 PLAYLIST</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tracks.map((t, i) => (
            <div key={i}
              onClick={() => { setCurrent(i); setPlaying(true); setTimeout(() => audioRef.current?.play().catch(() => {}), 200); }}
              style={{
                background: current === i ? colors.pixel : colors.card,
                border: `2px solid ${current === i ? colors.accent : colors.border}`,
                borderRadius: '16px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer',
              }}>
              <span style={{ fontSize: '20px' }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: colors.text, fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{t.title}</p>
                <p style={{ color: colors.muted, fontSize: '10px', fontWeight: '600', margin: 0 }}>{t.artist}</p>
              </div>
              {current === i && playing && (
                <span style={{ color: colors.accent, fontSize: '12px', fontWeight: 'bold' }}>♪</span>
              )}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes bar0 { from{height:4px} to{height:26px} }
          @keyframes bar1 { from{height:10px} to{height:20px} }
          @keyframes bar2 { from{height:6px} to{height:30px} }
          @keyframes bar3 { from{height:14px} to{height:18px} }
        `}</style>
      </div>
    </div>
  );
}


