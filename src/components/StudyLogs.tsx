import React, { useState } from 'react';
import { FocusSession, FocusSettings } from '../types/index.ts';
import { Calendar, Clock, Flame, BookOpen, Trash2, Edit3, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface StudyLogsProps {
  sessions: FocusSession[];
  settings: FocusSettings;
  onDeleteSession: (id: string) => void;
  onUpdateReflection: (id: string, reflection: string) => void;
}

export const StudyLogs: React.FC<StudyLogsProps> = ({
  sessions,
  settings,
  onDeleteSession,
  onUpdateReflection,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reflectionInput, setReflectionInput] = useState<string>('');

  // Calculate daily stats
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.timestamp).toDateString() === today
  );

  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalMinutesAllTime = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const goalPercent = Math.min(
    100,
    Math.round((todayMinutes / (settings.dailyGoalMinutes || 180)) * 100)
  );

  const startEdit = (session: FocusSession) => {
    sound.playWoodClick(0.15);
    setEditingId(session.id);
    setReflectionInput(session.reflection || '');
  };

  const saveEdit = (id: string) => {
    sound.playWoodClick(0.2);
    onUpdateReflection(id, reflectionInput);
    setEditingId(null);
  };

  return (
    <div className="max-w-[840px] mx-auto px-4 py-8 sm:py-12">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#26170C] tracking-tight mb-2">
          Study Log & Contemplations
        </h2>
        <p className="text-sm text-[#73685F]">
          A quiet ledger of sustained thought, craft, and mindful progress.
        </p>
      </div>

      {/* Top Stat Cards (Zero-pill discipline, warm Sandalwood surface) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Today Focus Metric */}
        <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-2">
            <Clock className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Today's Focus</span>
          </div>
          <div className="font-sans-timer text-3xl font-light text-[#26170C]">
            {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
          </div>
          <div className="text-xs text-[#73685F] mt-2 flex items-center justify-between">
            <span>Goal: {Math.floor(settings.dailyGoalMinutes / 60)}h</span>
            <span className="font-semibold text-[#8B5A2B]">{goalPercent}%</span>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-[#E2DDD4] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#8B5A2B] h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Completed Blocks */}
        <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5A6B5C]" />
            <span>Completed Blocks</span>
          </div>
          <div className="font-sans-timer text-3xl font-light text-[#26170C]">
            {todaySessions.length}
          </div>
          <div className="text-xs text-[#73685F] mt-2">
            <span>{sessions.length} recorded all-time</span>
          </div>
        </div>

        {/* Total Focus Hours */}
        <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#73685F] mb-2">
            <Flame className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Cumulative Craft</span>
          </div>
          <div className="font-sans-timer text-3xl font-light text-[#26170C]">
            {(totalMinutesAllTime / 60).toFixed(1)} <span className="text-sm font-normal text-[#73685F]">hrs</span>
          </div>
          <div className="text-xs text-[#73685F] mt-2">
            <span>Deep work dedicated</span>
          </div>
        </div>
      </div>

      {/* Japanese Stone Garden (Pebble Ritual) */}
      <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-6 mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif-editorial text-lg text-[#26170C]">
              Daily Pebble Garden
            </h3>
            <p className="text-xs text-[#73685F]">
              Each focus block grounds a smooth river stone into your daily garden.
            </p>
          </div>
          <div className="text-xs font-medium text-[#8B5A2B] font-sans-timer">
            {todaySessions.length} / 6 Stones Placed
          </div>
        </div>

        {/* Pebble Tray */}
        <div className="bg-[#FCF9F3] border border-[#E2DDD4] rounded-xl p-5 flex items-center justify-center gap-4 sm:gap-6 flex-wrap shadow-inner">
          {Array.from({ length: 6 }).map((_, idx) => {
            const hasStone = idx < todaySessions.length;
            const session = todaySessions[idx];
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1.5 group relative"
                title={hasStone ? `${session?.subject} (${session?.durationMinutes}m)` : `Stone slot ${idx + 1}`}
              >
                <div
                  className={`w-10 h-7 rounded-[50%_50%_45%_45%] transition-all duration-500 shadow-sm flex items-center justify-center ${
                    hasStone
                      ? 'bg-[#3D2B1F] text-[#FCF9F3] scale-100 hover:bg-[#5A6B5C]'
                      : 'bg-[#E5E2DC] border border-dashed border-[#C5BFB5] opacity-60 scale-95'
                  }`}
                >
                  {hasStone && <span className="text-[10px] opacity-75 font-serif-editorial font-light">{idx + 1}</span>}
                </div>
                <span className="text-[10px] text-[#73685F]">
                  {hasStone ? `${session.durationMinutes}m` : 'Empty'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session Entries List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-editorial text-xl text-[#26170C]">
            Session Chronicles
          </h3>
          <span className="text-xs text-[#73685F]">{sessions.length} total entries</span>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-[#EFECE4] border border-[#E2DDD4] rounded-2xl p-8 text-center text-[#73685F]">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#8B5A2B]" />
            <p className="font-serif-editorial text-base text-[#26170C] mb-1">
              Your journal is waiting
            </p>
            <p className="text-xs">
              Complete your first focus ritual to engrave your craft and thoughts here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const dateStr = new Date(session.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });
              const timeStr = new Date(session.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={session.id}
                  className="bg-[#EFECE4] border border-[#E2DDD4] rounded-xl p-4 sm:p-5 transition-all hover:border-[#8B5A2B]/40"
                >
                  {/* Clean unboxed metadata with separators (Strict Zero-Pill discipline) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#73685F] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#26170C]">{session.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-sans-timer">{session.durationMinutes} minutes</span>
                      <span aria-hidden="true">·</span>
                      <span>{dateStr} at {timeStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(session)}
                        className="text-[#73685F] hover:text-[#26170C] p-1 cursor-pointer"
                        title="Edit reflection"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playWoodClick(0.15);
                          onDeleteSession(session.id);
                        }}
                        className="text-[#73685F] hover:text-[#BA1A1A] p-1 cursor-pointer"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Intention statement */}
                  {session.intention && (
                    <div className="text-sm font-medium text-[#26170C] mb-2">
                      “{session.intention}”
                    </div>
                  )}

                  {/* Reflection note */}
                  {editingId === session.id ? (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={reflectionInput}
                        onChange={(e) => setReflectionInput(e.target.value)}
                        placeholder="Add a mindful thought or takeaway..."
                        className="flex-1 bg-white border border-[#E2DDD4] rounded-lg px-3 py-1.5 text-xs text-[#26170C] focus:outline-none focus:border-[#8B5A2B]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(session.id);
                        }}
                      />
                      <button
                        onClick={() => saveEdit(session.id)}
                        className="px-3 py-1.5 bg-[#3D2B1F] text-[#FCF9F3] rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1.5 text-xs text-[#73685F] hover:text-[#26170C] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : session.reflection ? (
                    <div className="mt-2 text-xs font-serif-editorial italic text-[#4F453F] bg-[#FCF9F3]/60 p-2.5 rounded-lg border border-[#E2DDD4]/60">
                      {session.reflection}
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(session)}
                      className="mt-1 text-xs text-[#8B5A2B] hover:underline cursor-pointer"
                    >
                      + Add mindful reflection
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
