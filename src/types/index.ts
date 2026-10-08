export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'flow';

export interface FocusSession {
  id: string;
  timestamp: number;
  durationMinutes: number;
  subject: string;
  intention: string;
  reflection?: string;
  completed: boolean;
}

export interface FocusSettings {
  focusDuration: number; // in minutes (e.g. 25, 50, 90)
  shortBreakDuration: number; // in minutes (e.g. 5)
  longBreakDuration: number; // in minutes (e.g. 15)
  dailyGoalMinutes: number; // in minutes (e.g. 180)
  ambientSound: 'none' | 'rain' | 'forest' | 'stream' | 'hearth';
  ambientVolume: number;
  chimesEnabled: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  completedBlocks: number;
}
