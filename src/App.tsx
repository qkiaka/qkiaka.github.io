/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { FocusTimer } from './components/FocusTimer.tsx';
import { SoundscapePanel } from './components/SoundscapePanel.tsx';
import { StudyLogs } from './components/StudyLogs.tsx';
import { MindfulSanctuary } from './components/MindfulSanctuary.tsx';
import { ReflectionModal } from './components/ReflectionModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { FocusSession, FocusSettings } from './types/index.ts';
import { sound } from './utils/audio.ts';

const DEFAULT_SETTINGS: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  dailyGoalMinutes: 180, // 3 hours
  ambientSound: 'none',
  ambientVolume: 0.35,
  chimesEnabled: true,
};

// Initial seeded sessions for welcoming experience
const INITIAL_SESSIONS: FocusSession[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 150,
    durationMinutes: 50,
    subject: 'Architecture',
    intention: 'Map spatial hierarchy and material joinery',
    reflection: 'Identified the center-weighted column grid and sanded radius geometry.',
    completed: true,
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 75,
    durationMinutes: 25,
    subject: 'Deep Code',
    intention: 'Procedural audio resonance synthesis',
    reflection: 'Harmonic 432Hz overtone decay creates an instant calming sensation.',
    completed: true,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'timer' | 'soundscape' | 'logs' | 'sanctuary'>('timer');
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem('sylvan_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [settings, setSettings] = useState<FocusSettings>(() => {
    try {
      const saved = localStorage.getItem('sylvan_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Soundscape state
  const [activeSoundscape, setActiveSoundscape] = useState<'none' | 'rain' | 'forest' | 'stream' | 'hearth'>('none');
  const [volume, setVolume] = useState<number>(settings.ambientVolume);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [reflectionState, setReflectionState] = useState<{
    isOpen: boolean;
    durationMinutes: number;
    subject: string;
    intention: string;
  }>({
    isOpen: false,
    durationMinutes: 25,
    subject: '',
    intention: '',
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sylvan_sessions', JSON.stringify(sessions));
    } catch {
      // Storage quota or error
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('sylvan_settings', JSON.stringify(settings));
    } catch {
      // Storage quota or error
    }
  }, [settings]);

  const handleSessionComplete = (durationMinutes: number, subject: string, intention: string) => {
    setReflectionState({
      isOpen: true,
      durationMinutes,
      subject,
      intention,
    });
  };

  const handleSaveReflection = (reflection: string) => {
    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      durationMinutes: reflectionState.durationMinutes,
      subject: reflectionState.subject || 'Deep Work',
      intention: reflectionState.intention,
      reflection: reflection.trim() || undefined,
      completed: true,
    };

    setSessions((prev) => [newSession, ...prev]);
    setReflectionState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateReflection = (id: string, reflection: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reflection } : s))
    );
  };

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Compute today's total focus minutes
  const todayStr = new Date().toDateString();
  const todayCompletedMinutes = sessions
    .filter((s) => new Date(s.timestamp).toDateString() === todayStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#FCF9F3] text-[#1C1C18] flex flex-col font-sans selection:bg-[#DEC1AF] selection:text-[#26170C]">
      {/* 1. Header (Navbar contract) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSettings={() => setIsSettingsOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        activeSoundscape={activeSoundscape}
      />

      {/* 2. Main Viewport Area (Constrained 960px container per brief) */}
      <main className="flex-1 w-full max-w-[960px] mx-auto pb-16">
        {currentTab === 'timer' && (
          <FocusTimer
            settings={settings}
            onSessionComplete={handleSessionComplete}
            todayCompletedMinutes={todayCompletedMinutes}
          />
        )}

        {currentTab === 'soundscape' && (
          <SoundscapePanel
            activeSoundscape={activeSoundscape}
            setActiveSoundscape={setActiveSoundscape}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {currentTab === 'logs' && (
          <StudyLogs
            sessions={sessions}
            settings={settings}
            onDeleteSession={handleDeleteSession}
            onUpdateReflection={handleUpdateReflection}
          />
        )}

        {currentTab === 'sanctuary' && <MindfulSanctuary />}
      </main>

      {/* 3. Quiet Minimal Footer */}
      <footer className="border-t border-[#E2DDD4] py-8 mt-auto bg-[#FCF9F3]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#73685F] gap-4">
          <div className="font-serif-editorial text-sm text-[#26170C] italic">
            “Quiet simplicity, honest craft, unhurried attention.”
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('sanctuary')}
              className="hover:text-[#26170C] transition-colors cursor-pointer"
            >
              Sanctuary
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#26170C] transition-colors cursor-pointer"
            >
              Preferences
            </button>
            <span aria-hidden="true">·</span>
            <span>Sylvan Focus © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <ReflectionModal
        isOpen={reflectionState.isOpen}
        onClose={() => setReflectionState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveReflection}
        durationMinutes={reflectionState.durationMinutes}
        subject={reflectionState.subject}
        intention={reflectionState.intention}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
