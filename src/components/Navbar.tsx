import React from 'react';
import { Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface NavbarProps {
  currentTab: 'timer' | 'soundscape' | 'logs' | 'sanctuary';
  setCurrentTab: (tab: 'timer' | 'soundscape' | 'logs' | 'sanctuary') => void;
  openSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeSoundscape: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openSettings,
  isMuted,
  onToggleMute,
  activeSoundscape,
}) => {
  return (
    <header className="border-b border-[#E2DDD4] bg-[#FCF9F3]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => {
            sound.playWoodClick(0.2);
            setCurrentTab('timer');
          }}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-editorial text-2xl tracking-tight text-[#26170C] group-hover:text-[#8B5A2B] transition-colors">
            Sylvan Focus
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean text with subtle active state) */}
        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium text-[#73685F]">
          <button
            onClick={() => {
              sound.playWoodClick(0.15);
              setCurrentTab('timer');
            }}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'timer'
                ? 'text-[#26170C] font-semibold border-b-2 border-[#8B5A2B]'
                : 'hover:text-[#26170C]'
            }`}
          >
            Focus Ritual
          </button>

          <button
            onClick={() => {
              sound.playWoodClick(0.15);
              setCurrentTab('soundscape');
            }}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'soundscape'
                ? 'text-[#26170C] font-semibold border-b-2 border-[#8B5A2B]'
                : 'hover:text-[#26170C]'
            }`}
          >
            <span>Soundscape</span>
            {activeSoundscape !== 'none' && !isMuted && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A6B5C] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playWoodClick(0.15);
              setCurrentTab('logs');
            }}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'logs'
                ? 'text-[#26170C] font-semibold border-b-2 border-[#8B5A2B]'
                : 'hover:text-[#26170C]'
            }`}
          >
            Study Logs
          </button>

          <button
            onClick={() => {
              sound.playWoodClick(0.15);
              setCurrentTab('sanctuary');
            }}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer hidden sm:flex items-center gap-1 ${
              currentTab === 'sanctuary'
                ? 'text-[#26170C] font-semibold border-b-2 border-[#8B5A2B]'
                : 'hover:text-[#26170C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Sanctuary</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playWoodClick(0.2);
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Muted' : 'Sound active'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4F453F] hover:text-[#26170C] hover:bg-[#EFECE4] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playWoodClick(0.2);
              openSettings();
            }}
            aria-label="Settings"
            title="Focus Settings"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4F453F] hover:text-[#26170C] hover:bg-[#EFECE4] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
