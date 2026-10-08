import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Coffee, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: string) => void;
  durationMinutes: number;
  subject: string;
  intention: string;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  durationMinutes,
  subject,
  intention,
}) => {
  const [reflection, setReflection] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWoodClick(0.2);
    onSave(reflection);
    setReflection('');
  };

  const handleSkip = () => {
    sound.playWoodClick(0.15);
    onSave('');
    setReflection('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FCF9F3] border border-[#E2DDD4] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#5A6B5C] mb-2">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Interval Concluded</span>
        </div>

        <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#26170C] leading-tight mb-2">
          A Mindful Moment to Reflect
        </h3>

        {/* Metadata summary (Strict Zero-pill) */}
        <div className="text-xs text-[#73685F] mb-6 flex items-center gap-2">
          <span className="font-semibold text-[#26170C]">{subject}</span>
          <span aria-hidden="true">·</span>
          <span className="font-sans-timer">{durationMinutes} minutes dedicated</span>
          {intention && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate italic max-w-[150px]">“{intention}”</span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-[#73685F] mb-2">
            What insights or clear progress emerged during this block?
          </label>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
            placeholder="e.g., Clarified the core design system tokens. Next step is drafting the responsive layout."
            className="w-full bg-[#EFECE4] border border-[#E2DDD4] rounded-xl p-3 text-sm text-[#26170C] placeholder-[#73685F]/60 focus:outline-none focus:border-[#8B5A2B] mb-6"
            autoFocus
          />

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2.5 text-xs text-[#73685F] hover:text-[#26170C] cursor-pointer"
            >
              Skip Reflection
            </button>

            <button
              type="submit"
              className="tactile-btn flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#3D2B1F] text-[#FCF9F3] text-xs font-medium shadow-md hover:bg-[#26170C] cursor-pointer"
            >
              <span>Record & Rest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
