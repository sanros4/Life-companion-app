'use client';
import { useState } from 'react';
import Landing      from '@/components/Landing';
import LockScreen   from '@/components/LockScreen';
import Dashboard    from '@/components/Dashboard';
import Settings     from '@/components/Settings';
import Planner      from '@/components/planner/Planner';
import Journal      from '@/components/journal/Journal';
import MoodTracker  from '@/components/mood/MoodTracker';
import SelfCare     from '@/components/selfcare/SelfCare';
import Timer        from '@/components/timer/Timer';
import MusicPlayer  from '@/components/music/MusicPlayer';

type Screen = 'landing' | 'lock' | 'dashboard' | 'settings' | 'planner' | 'journal' | 'mood' | 'selfcare' | 'timer' | 'music';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  return (
    <main>
      {screen === 'landing'   && <Landing     onEnter={() => setScreen('lock')} />}
      {screen === 'lock'      && <LockScreen  onUnlock={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard
                                    onSettings={() => setScreen('settings')}
                                    onPlanner={() => setScreen('planner')}
                                    onJournal={() => setScreen('journal')}
                                    onMood={() => setScreen('mood')}
                                    onSelfCare={() => setScreen('selfcare')}
                                    onTimer={() => setScreen('timer')}
                                    onMusic={() => setScreen('music')} />}
      {screen === 'settings'  && <Settings    onBack={() => setScreen('dashboard')} />}
      {screen === 'planner'   && <Planner     onBack={() => setScreen('dashboard')} />}
      {screen === 'journal'   && <Journal     onBack={() => setScreen('dashboard')} />}
      {screen === 'mood'      && <MoodTracker onBack={() => setScreen('dashboard')} />}
      {screen === 'selfcare'  && <SelfCare    onBack={() => setScreen('dashboard')} />}
      {screen === 'timer'     && <Timer       onBack={() => setScreen('dashboard')} />}
      {screen === 'music'     && <MusicPlayer onBack={() => setScreen('dashboard')} />}
    </main>
  );
}
