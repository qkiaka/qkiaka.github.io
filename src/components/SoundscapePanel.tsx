import React from 'react';
import { Volume2, VolumeX, Wind, Droplets, Flame, CloudRain, Bell, Check } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface SoundscapePanelProps {
  activeSoundscape: 'none' | 'rain' | 'forest' | 'stream' | 'hearth';
  setActiveSoundscape: (soundscape: 'none' | 'rain' | 'forest' | 'stream' | 'hearth') => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface SoundItem {
  id: 'none' | 'forest' | 'stream' | 'rain' | 'hearth';
  name: string;
  japanese: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const SOUNDSCAPES: SoundItem[] = [
  {
    id: 'forest',
    name: 'Kyoto Forest Mist',
    japanese: '森の霞',
    description: 'Swaying cedar branches and filtered canopy breeze in the Arashiyama hills.',
    icon: <Wind className="w-5 h-5 text-[#5A6B5C]" />,
    image: '/src/assets/images/sylvan_forest_moss_1791463712718.jpg',
  },
  {
    id: 'stream',
    name: 'Mountain Stream',
    japanese: '渓流のせせらぎ',
    description: 'Clear cool spring water cascading across weathered river stones.',
    icon: <Droplets className="w-5 h-5 text-[#8B5A2B]" />,
    image: '/src/assets/images/sylvan_desk_zen_1791463699358.jpg',
  },
  {
    id: 'rain',
    name: 'Linen Rain',
    japanese: '雨だれの響き',
    description: 'Delicate summer rain pattering rhythmically against an engawa wooden veranda.',
    icon: <CloudRain className="w-5 h-5 text-[#5A6B5C]" />,
    image: '/src/assets/images/sylvan_tea_ceramic_1791463723704.jpg',
  },
  {
    id: 'hearth',
    name: 'Cedar Hearth',
    japanese: '炉辺の温もり',
    description: 'Subtle resonant ember warmth and deep calming acoustic grounding.',
    icon: <Flame className="w-5 h-5 text-[#8B5A2B]" />,
  },
];

export const SoundscapePanel: React.FC<SoundscapePanelProps> = ({
  activeSoundscape,
  setActiveSoundscape,
  volume,
  setVolume,
  isMuted,
  onToggleMute,
}) => {
  const handleSelect = (id: 'none' | 'forest' | 'stream' | 'rain' | 'hearth') => {
    sound.playWoodClick(0.2);
    if (activeSoundscape === id) {
      sound.stopSoundscape();
      setActiveSoundscape('none');
    } else if (id === 'none') {
      sound.stopSoundscape();
      setActiveSoundscape('none');
    } else {
      setActiveSoundscape(id);
      sound.startSoundscape(id, volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setSoundscapeVolume(val);
  };

  const handleTestChime = () => {
    sound.playSingingBowl(0.6);
  };

  return (
    <div className="max-w-[840px] mx-auto px-4 py-8 sm:py-12">
      {/* Title & Introduction */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#26170C] tracking-tight mb-2">
          Focus Soundscape & Resonance
        </h2>
        <p className="text-sm text-[#73685F] max-w-xl">
          Procedurally generated organic audio frequencies designed to quiet mental turbulence and
          shield deep contemplation from digital distractions.
        </p>
      </div>

      {/* Master Volume & Chime Test Bar */}
      <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Volume controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-full bg-[#FCF9F3] border border-[#E2DDD4] flex items-center justify-center text-[#26170C] cursor-pointer hover:bg-[#E5E2DC]"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex-1 sm:w-48">
            <div className="flex justify-between text-xs text-[#73685F] mb-1 font-medium">
              <span>Ambient Volume</span>
              <span className="font-sans-timer">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-full accent-[#8B5A2B] cursor-pointer"
            />
          </div>
        </div>

        {/* Singing Bowl Test Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestChime}
            className="tactile-btn flex items-center gap-2 px-4 py-2 rounded-full bg-[#FCF9F3] border border-[#E2DDD4] text-xs font-medium text-[#26170C] hover:border-[#8B5A2B] cursor-pointer shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Singing Bowl (432 Hz)</span>
          </button>

          {activeSoundscape !== 'none' && (
            <button
              onClick={() => handleSelect('none')}
              className="px-3 py-2 text-xs text-[#73685F] hover:text-[#26170C] underline cursor-pointer"
            >
              Silence Ambient
            </button>
          )}
        </div>
      </div>

      {/* Soundscape Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOUNDSCAPES.map((item) => {
          const isActive = activeSoundscape === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`group relative rounded-2xl border p-5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FCF9F3] border-[#8B5A2B] shadow-[0_4px_16px_rgba(139,90,43,0.12)] ring-1 ring-[#8B5A2B]'
                  : 'bg-[#EFECE4] border-[#E2DDD4] hover:border-[#8B5A2B]/40'
              }`}
            >
              {/* Optional Visual Image Backdrop */}
              {item.image && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 bg-[#E5E2DC]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-2 right-2 text-[10px] text-white/90 font-serif-editorial tracking-widest px-2 py-0.5 rounded backdrop-blur-sm bg-black/20">
                    {item.japanese}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-[#8B5A2B] text-white' : 'bg-[#FCF9F3] border border-[#E2DDD4]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-lg text-[#26170C] font-normal leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs text-[#73685F]">{item.japanese}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs transition-colors ${
                    isActive
                      ? 'bg-[#5A6B5C] border-[#5A6B5C] text-white'
                      : 'border-[#E2DDD4] text-transparent group-hover:border-[#73685F]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-[#4F453F] mt-3 leading-relaxed">
                {item.description}
              </p>

              {isActive && (
                <div className="mt-3 pt-3 border-t border-[#E2DDD4]/60 flex items-center justify-between text-xs text-[#5A6B5C] font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5A6B5C] animate-ping" />
                    <span>Soundscape Playing</span>
                  </span>
                  <span className="text-[#8B5A2B] hover:underline">Tap to stop</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
