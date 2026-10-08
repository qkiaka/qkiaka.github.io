import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { TimerMode, FocusSettings } from '../types/index.ts';
import { sound } from '../utils/audio.ts';

interface FocusTimerProps {
  settings: FocusSettings;
  onSessionComplete: (durationMinutes: number, subject: string, intention: string) => void;
  todayCompletedMinutes: number;
}

const DEFAULT_SUBJECTS = ['Deep Code', 'Writing', 'Architecture', 'Reading', 'Philosophy', 'Research'];

export const FocusTimer: React.FC<FocusTimerProps> = ({
  settings,
  onSessionComplete,
  todayCompletedMinutes,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [customMinutes, setCustomMinutes] = useState<number>(settings.focusDuration);
  const [timeLeft, setTimeLeft] = useState<number>(settings.focusDuration * 60);
  const [totalDuration, setTotalDuration] = useState<number>(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedFlowSeconds, setElapsedFlowSeconds] = useState<number>(0);

  const [selectedSubject, setSelectedSubject] = useState<string>('Deep Code');
  const [intention, setIntention] = useState<string>('');
  const [isEditingIntention, setIsEditingIntention] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);

  const [sessionCount, setSessionCount] = useState<number>(1);
  const timerRef = useRef<number | null>(null);

  // Sync when mode changes or settings change
  const switchMode = (newMode: TimerMode, durationMins?: number) => {
    sound.playWoodClick(0.2);
    setIsRunning(false);
    setMode(newMode);

    let duration = 25;
    if (newMode === 'focus') {
      duration = durationMins ?? customMinutes;
      setCustomMinutes(duration);
    } else if (newMode === 'shortBreak') {
      duration = settings.shortBreakDuration;
    } else if (newMode === 'longBreak') {
      duration = settings.longBreakDuration;
    } else if (newMode === 'flow') {
      setElapsedFlowSeconds(0);
      return;
    }

    const secs = duration * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
  };

  // Timer Tick Engine
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'flow') {
          setElapsedFlowSeconds((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              sound.playSingingBowl(0.7);

              const durationMins = Math.round(totalDuration / 60);
              if (mode === 'focus') {
                setSessionCount((sc) => (sc % 4) + 1);
                onSessionComplete(durationMins, selectedSubject, intention);
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, totalDuration, selectedSubject, intention, onSessionComplete]);

  // Handle Play/Pause
  const togglePlay = () => {
    sound.playWoodClick(0.3);
    if (!isRunning) {
      // Starting session: play gentle bowl chime if focus beginning
      if (timeLeft === totalDuration && mode === 'focus') {
        sound.playSingingBowl(0.4);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    sound.playWoodClick(0.2);
    setIsRunning(false);
    if (mode === 'flow') {
      setElapsedFlowSeconds(0);
    } else {
      setTimeLeft(totalDuration);
    }
  };

  const handleAddFiveMinutes = () => {
    sound.playWoodClick(0.2);
    if (mode !== 'flow') {
      setTimeLeft((prev) => prev + 300);
      setTotalDuration((prev) => prev + 300);
    }
  };

  const handleManualComplete = () => {
    sound.playWoodClick(0.25);
    setIsRunning(false);
    sound.playSingingBowl(0.65);
    const completedMinutes = mode === 'flow'
      ? Math.max(1, Math.round(elapsedFlowSeconds / 60))
      : Math.max(1, Math.round((totalDuration - timeLeft) / 60));

    if (mode === 'focus' || mode === 'flow') {
      setSessionCount((sc) => (sc % 4) + 1);
      onSessionComplete(completedMinutes, selectedSubject, intention);
    }
    handleReset();
  };

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ring Calculation
  const progressPercent = mode === 'flow'
    ? 1
    : totalDuration > 0
    ? (totalDuration - timeLeft) / totalDuration
    : 0;

  const ringRadius = 148;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  const handleAddSubjectTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !subjects.includes(newTagInput.trim())) {
      setSubjects([...subjects, newTagInput.trim()]);
      setSelectedSubject(newTagInput.trim());
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* 1. Mode Segmented Selector */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#EFECE4] border border-[#E2DDD4] rounded-full mb-8">
        <button
          onClick={() => switchMode('focus', 25)}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
            mode === 'focus'
              ? 'bg-[#3D2B1F] text-[#FCF9F3] shadow-sm'
              : 'text-[#73685F] hover:text-[#26170C]'
          }`}
        >
          Deep Focus
        </button>

        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-[#5A6B5C] text-[#FCF9F3] shadow-sm'
              : 'text-[#73685F] hover:text-[#26170C]'
          }`}
        >
          Tea Break (5m)
        </button>

        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-[#5A6B5C] text-[#FCF9F3] shadow-sm'
              : 'text-[#73685F] hover:text-[#26170C]'
          }`}
        >
          Long Rest (15m)
        </button>

        <button
          onClick={() => switchMode('flow')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
            mode === 'flow'
              ? 'bg-[#8B5A2B] text-[#FCF9F3] shadow-sm'
              : 'text-[#73685F] hover:text-[#26170C]'
          }`}
        >
          Open Flow
        </button>
      </div>

      {/* Preset duration selector for Deep Focus */}
      {mode === 'focus' && (
        <div className="flex items-center gap-2 mb-8">
          {[25, 50, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => switchMode('focus', mins)}
              disabled={isRunning}
              className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                customMinutes === mins
                  ? 'border-[#8B5A2B] bg-[#EFECE4] text-[#8B5A2B] font-semibold'
                  : 'border-[#E2DDD4] text-[#73685F] hover:border-[#8B5A2B]/50'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mins} min
            </button>
          ))}
        </div>
      )}

      {/* 2. Tactile Circular Timer Display */}
      <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center mb-8">
        {/* Soft background glow & timber depth */}
        <div className="absolute inset-4 rounded-full bg-[#EFECE4]/50 border border-[#E2DDD4]/60 -z-10 shadow-inner" />

        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 340 340">
          {/* Track ring */}
          <circle
            cx="170"
            cy="170"
            r={ringRadius}
            fill="none"
            stroke="#E2DDD4"
            strokeWidth="7"
          />

          {/* Active progress ring */}
          <circle
            cx="170"
            cy="170"
            r={ringRadius}
            fill="none"
            stroke={mode === 'focus' ? '#8B5A2B' : mode === 'flow' ? '#8B5A2B' : '#5A6B5C'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Display Information */}
        <div className="absolute flex flex-col items-center justify-center text-center px-4">
          {/* Subtle session indicator */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-1">
            {mode === 'focus' && (
              <>
                <span>Ritual block {sessionCount} of 4</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-[#8B5A2B]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Deep Work</span>
                </span>
              </>
            )}
            {mode === 'shortBreak' && <span>Rest & Refresh</span>}
            {mode === 'longBreak' && <span>Extended Contemplation</span>}
            {mode === 'flow' && <span>Unconstrained Flow</span>}
          </div>

          {/* Big Manrope Tabular Timer */}
          <div className="font-sans-timer text-6xl sm:text-7xl font-light tracking-tight text-[#26170C] select-none my-1">
            {mode === 'flow' ? formatTime(elapsedFlowSeconds) : formatTime(timeLeft)}
          </div>

          {/* Intention statement under timer */}
          <div className="max-w-[220px] text-xs text-[#4F453F] mt-1 truncate">
            {intention ? `“${intention}”` : 'Single-minded presence'}
          </div>
        </div>
      </div>

      {/* 3. Intention Input / Prompt Bar */}
      <div className="w-full max-w-[480px] bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-4 mb-8">
        <div className="flex items-center justify-between text-xs text-[#73685F] mb-1.5 font-medium">
          <span>Intention for this block</span>
          {!isEditingIntention && intention && (
            <button
              onClick={() => setIsEditingIntention(true)}
              className="text-[#8B5A2B] hover:underline cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingIntention || !intention ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g., Draft architectural principles chapter..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingIntention(false);
              }}
              className="w-full bg-[#FCF9F3] border border-[#E2DDD4] rounded-lg px-3 py-1.5 text-sm text-[#26170C] placeholder-[#73685F]/60 focus:outline-none focus:border-[#8B5A2B]"
            />
            {intention && (
              <button
                onClick={() => setIsEditingIntention(false)}
                className="px-3 py-1.5 text-xs bg-[#3D2B1F] text-[#FCF9F3] rounded-lg font-medium cursor-pointer"
              >
                Set
              </button>
            )}
          </div>
        ) : (
          <p
            onClick={() => setIsEditingIntention(true)}
            className="text-sm font-serif-editorial italic text-[#26170C] cursor-pointer hover:text-[#8B5A2B] transition-colors"
          >
            “{intention}”
          </p>
        )}
      </div>

      {/* 4. Subject Tags Filter (Pill Chips per design brief) */}
      <div className="w-full max-w-[560px] flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-xs text-[#73685F] font-medium mr-1">Subject:</span>
        {subjects.map((subj) => {
          const isActive = selectedSubject === subj;
          return (
            <button
              key={subj}
              onClick={() => {
                sound.playWoodClick(0.15);
                setSelectedSubject(subj);
              }}
              className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#5A6B5C] text-[#FCF9F3] font-medium shadow-sm'
                  : 'bg-[#EFECE4] text-[#73685F] hover:text-[#26170C] border border-[#E2DDD4]'
              }`}
            >
              {subj}
            </button>
          );
        })}

        {isAddingTag ? (
          <form onSubmit={handleAddSubjectTag} className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Tag name"
              autoFocus
              className="px-2 py-0.5 text-xs bg-white border border-[#E2DDD4] rounded-full focus:outline-none focus:border-[#8B5A2B] w-24"
            />
            <button
              type="submit"
              className="text-xs px-2 py-0.5 bg-[#3D2B1F] text-white rounded-full cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingTag(false)}
              className="text-xs text-[#73685F] px-1 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="px-2.5 py-1 text-xs rounded-full border border-dashed border-[#E2DDD4] text-[#73685F] hover:text-[#26170C] hover:border-[#8B5A2B] transition-colors cursor-pointer"
          >
            + Add
          </button>
        )}
      </div>

      {/* 5. Tactile Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Reset / Rewind */}
        <button
          onClick={handleReset}
          title="Reset interval"
          aria-label="Reset timer"
          className="w-12 h-12 rounded-full bg-[#EFECE4] border border-[#E2DDD4] flex items-center justify-center text-[#4F453F] hover:text-[#26170C] hover:bg-[#E5E2DC] tactile-btn cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Primary Action Button (Walnut Pill) */}
        <button
          onClick={togglePlay}
          className="tactile-btn flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#3D2B1F] hover:bg-[#26170C] text-[#FCF9F3] text-base font-medium shadow-[0_4px_16px_rgba(61,43,31,0.14)] cursor-pointer min-w-[170px]"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Ritual</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{timeLeft < totalDuration && timeLeft > 0 ? 'Resume' : 'Start Focus'}</span>
            </>
          )}
        </button>

        {/* Complete early / Add 5 min */}
        {mode !== 'flow' ? (
          <button
            onClick={handleAddFiveMinutes}
            title="Extend by 5 minutes"
            aria-label="Add 5 minutes"
            className="w-12 h-12 rounded-full bg-[#EFECE4] border border-[#E2DDD4] flex items-center justify-center text-[#4F453F] hover:text-[#26170C] hover:bg-[#E5E2DC] tactile-btn cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleManualComplete}
            title="Conclude flow session"
            aria-label="Conclude flow session"
            className="w-12 h-12 rounded-full bg-[#EFECE4] border border-[#E2DDD4] flex items-center justify-center text-[#5A6B5C] hover:text-[#26170C] hover:bg-[#E5E2DC] tactile-btn cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Manual finish block option when partially progressed */}
      {isRunning && (
        <button
          onClick={handleManualComplete}
          className="mt-6 text-xs text-[#73685F] hover:text-[#26170C] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5C]" />
          <span>Conclude this block early & record notes</span>
        </button>
      )}

      {/* Daily Progress Ribbon */}
      <div className="mt-12 pt-6 border-t border-[#E2DDD4] w-full flex items-center justify-between text-xs text-[#73685F]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
          <span>Today's Mindful Focus:</span>
          <span className="font-semibold text-[#26170C] font-sans-timer">
            {Math.floor(todayCompletedMinutes / 60)}h {todayCompletedMinutes % 60}m
          </span>
          <span aria-hidden="true">·</span>
          <span>Target: {Math.floor(settings.dailyGoalMinutes / 60)}h</span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, idx) => {
            const isFilled = idx < Math.min(4, Math.floor(todayCompletedMinutes / (settings.focusDuration || 25)));
            return (
              <div
                key={idx}
                title={`Focus Pebble ${idx + 1}`}
                className={`w-3 h-2.5 rounded-full transition-all duration-300 ${
                  isFilled ? 'bg-[#5A6B5C]' : 'bg-[#E2DDD4]'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
