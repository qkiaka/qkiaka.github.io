import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles, Compass } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface Quote {
  text: string;
  author: string;
  discipline: string;
}

const QUOTES: Quote[] = [
  {
    text: "Each tree has its own unique spirit. When we work with timber, we must listen to what the grain wishes to become.",
    author: "George Nakashima",
    discipline: "Master Woodworker & Architect",
  },
  {
    text: "Simplicity is not a lack of clutter, but the deliberate choice to preserve what is essential to the spirit.",
    author: "Sen no Rikyū",
    discipline: "Wabi-cha Tea Master",
  },
  {
    text: "True beauty does not clamor for attention. It rests in quiet utility, honest material, and unhurried hands.",
    author: "Sōetsu Yanagi",
    discipline: "Mingei Craft Philosophy",
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the single present moment.",
    author: "Dōgen Zenji",
    discipline: "Zen Scholar",
  },
  {
    text: "The quieter you become, the more you are able to hear.",
    author: "Ancient Proverb",
    discipline: "Contemplative Tradition",
  },
];

export const MindfulSanctuary: React.FC = () => {
  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);

  // Breathing Box State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  useEffect(() => {
    let interval: number;
    if (isBreathingActive) {
      interval = window.setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              if (current === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4; // 4-second box cycles
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const toggleBreathing = () => {
    sound.playWoodClick(0.2);
    if (!isBreathingActive) {
      sound.playSingingBowl(0.35);
      setBreathPhase('Inhale');
      setBreathSeconds(4);
      setIsBreathingActive(true);
    } else {
      setIsBreathingActive(false);
    }
  };

  const nextQuote = () => {
    sound.playWoodClick(0.15);
    setActiveQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  const currentQuote = QUOTES[activeQuoteIdx];

  return (
    <div className="max-w-[840px] mx-auto px-4 py-8 sm:py-12">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#26170C] tracking-tight mb-2">
          Mindful Sanctuary & Stillness
        </h2>
        <p className="text-sm text-[#73685F]">
          A tranquil alcove for centering breath, timeless artisan wisdom, and visual serenity.
        </p>
      </div>

      {/* Guided Breathing Section (Box Breathing) */}
      <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#73685F] font-medium mb-3">
            <Wind className="w-4 h-4 text-[#5A6B5C]" />
            <span>4×4 Box Breathing Ritual</span>
          </div>

          <h3 className="font-serif-editorial text-2xl text-[#26170C] mb-6">
            Regulate Your Nervous System
          </h3>

          {/* Breathing Circle Visualizer */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center mb-6">
            <div
              className={`absolute inset-0 rounded-full border border-[#8B5A2B]/30 transition-transform duration-1000 ease-in-out ${
                isBreathingActive && (breathPhase === 'Inhale' || breathPhase === 'Hold')
                  ? 'scale-110 bg-[#8B5A2B]/10'
                  : 'scale-90 bg-[#FCF9F3]'
              }`}
            />
            <div
              className={`w-28 h-28 rounded-full bg-[#5A6B5C] text-[#FCF9F3] flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${
                isBreathingActive && breathPhase === 'Inhale'
                  ? 'scale-105 bg-[#8B5A2B]'
                  : isBreathingActive && breathPhase === 'Exhale'
                  ? 'scale-90 bg-[#5A6B5C]'
                  : 'scale-95'
              }`}
            >
              <span className="font-serif-editorial text-lg tracking-wide">
                {isBreathingActive ? breathPhase : 'Begin'}
              </span>
              {isBreathingActive && (
                <span className="font-sans-timer text-xs opacity-80 mt-0.5">
                  {breathSeconds}s
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#73685F] mb-6 max-w-xs mx-auto">
            {isBreathingActive
              ? breathPhase === 'Inhale'
                ? 'Gently draw breath in through the nostrils.'
                : breathPhase === 'Hold'
                ? 'Sustain peaceful stillness without tension.'
                : breathPhase === 'Exhale'
                ? 'Release slowly and completely through the lips.'
                : 'Pause and notice the clear space between breaths.'
              : 'Take four cycles before your next deep work interval to foster effortless concentration.'}
          </p>

          <button
            onClick={toggleBreathing}
            className="tactile-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3D2B1F] text-[#FCF9F3] text-xs font-medium cursor-pointer shadow-sm hover:bg-[#26170C]"
          >
            {isBreathingActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Breathing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin 4×4 Pacing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Artisan Wisdom Card */}
      <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 mb-8 relative">
        <div className="flex items-center justify-between text-xs text-[#73685F] mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Master Craftsman Wisdom</span>
          </div>
          <button
            onClick={nextQuote}
            className="text-xs text-[#8B5A2B] hover:underline cursor-pointer"
          >
            Next Thought →
          </button>
        </div>

        <blockquote className="font-serif-editorial text-xl sm:text-2xl text-[#26170C] leading-snug italic mb-4">
          “{currentQuote.text}”
        </blockquote>

        <div className="text-xs text-[#73685F]">
          <span className="font-semibold text-[#26170C]">{currentQuote.author}</span>
          <span aria-hidden="true" className="mx-1.5">·</span>
          <span>{currentQuote.discipline}</span>
        </div>
      </div>

      {/* Visual Zen Gallery (Japandi & Nordic Craft Photography) */}
      <div className="mb-8">
        <h3 className="font-serif-editorial text-xl text-[#26170C] mb-3">
          Atmospheric Sanctuaries
        </h3>
        <p className="text-xs text-[#73685F] mb-4">
          Visual studies of natural timber, moss gardens, and unadorned ceramics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl overflow-hidden group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/sylvan_desk_zen_1791463699358.jpg"
                alt="Minimalist wooden desk study"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3.5">
              <h4 className="font-serif-editorial text-base text-[#26170C]">The Study Desk</h4>
              <p className="text-[11px] text-[#73685F] mt-0.5">Sanded oak, morning light, honest work.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl overflow-hidden group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/sylvan_forest_moss_1791463712718.jpg"
                alt="Kyoto moss sanctuary garden"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3.5">
              <h4 className="font-serif-editorial text-base text-[#26170C]">Moss & Stepping Stone</h4>
              <p className="text-[11px] text-[#73685F] mt-0.5">Rain-washed greenery, quiet patience.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl overflow-hidden group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/sylvan_tea_ceramic_1791463723704.jpg"
                alt="Handcrafted ceramic tea chawan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3.5">
              <h4 className="font-serif-editorial text-base text-[#26170C]">The Tea Chawan</h4>
              <p className="text-[11px] text-[#73685F] mt-0.5">Warm ceramic cup, mindful pause between tasks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
