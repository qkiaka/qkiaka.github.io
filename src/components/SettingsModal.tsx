import React from 'react';
import { X, Sliders, Bell, Target, Clock } from 'lucide-react';
import { FocusSettings } from '../types/index.ts';
import { sound } from '../utils/audio.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FocusSettings;
  onUpdateSettings: (newSettings: FocusSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof FocusSettings>(key: K, value: FocusSettings[K]) => {
    sound.playWoodClick(0.15);
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FCF9F3] border border-[#E2DDD4] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8B5A2B]" />
            <h3 className="font-serif-editorial text-2xl text-[#26170C]">
              Ritual Preferences
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playWoodClick(0.15);
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#73685F] hover:bg-[#EFECE4] hover:text-[#26170C] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Focus Duration */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Default Focus Interval</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 25, 45, 50].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChange('focusDuration', mins)}
                  className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-sans-timer ${
                    settings.focusDuration === mins
                      ? 'bg-[#3D2B1F] text-[#FCF9F3] border-[#3D2B1F] font-semibold'
                      : 'bg-[#EFECE4] text-[#73685F] border-[#E2DDD4] hover:border-[#8B5A2B]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Break Durations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#73685F] mb-2">
                Short Break
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleChange('shortBreakDuration', mins)}
                    className={`flex-1 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-sans-timer ${
                      settings.shortBreakDuration === mins
                        ? 'bg-[#5A6B5C] text-[#FCF9F3] border-[#5A6B5C]'
                        : 'bg-[#EFECE4] text-[#73685F] border-[#E2DDD4]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#73685F] mb-2">
                Long Break
              </label>
              <div className="flex gap-2">
                {[15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleChange('longBreakDuration', mins)}
                    className={`flex-1 py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-sans-timer ${
                      settings.longBreakDuration === mins
                        ? 'bg-[#5A6B5C] text-[#FCF9F3] border-[#5A6B5C]'
                        : 'bg-[#EFECE4] text-[#73685F] border-[#E2DDD4]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Daily Focus Target</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[120, 180, 240, 300].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleChange('dailyGoalMinutes', mins)}
                  className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-sans-timer ${
                    settings.dailyGoalMinutes === mins
                      ? 'bg-[#8B5A2B] text-[#FCF9F3] border-[#8B5A2B] font-semibold'
                      : 'bg-[#EFECE4] text-[#73685F] border-[#E2DDD4]'
                  }`}
                >
                  {mins / 60} hrs
                </button>
              ))}
            </div>
          </div>

          {/* Singing Bowl Chime */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2DDD4]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8B5A2B]" />
              <div>
                <div className="text-xs font-medium text-[#26170C]">Tibetan Singing Bowl Chimes</div>
                <div className="text-[11px] text-[#73685F]">Harmonic 432Hz bell on start & finish</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('chimesEnabled', !settings.chimesEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.chimesEnabled ? 'bg-[#5A6B5C]' : 'bg-[#E2DDD4]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  settings.chimesEnabled ? 'translate-x-6' : 'translate-x-1'
                } top-1 absolute`}
              />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-8 pt-4 border-t border-[#E2DDD4] flex justify-end">
          <button
            onClick={() => {
              sound.playWoodClick(0.2);
              onClose();
            }}
            className="tactile-btn px-6 py-2.5 rounded-full bg-[#3D2B1F] text-[#FCF9F3] text-xs font-medium cursor-pointer shadow-sm hover:bg-[#26170C]"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
