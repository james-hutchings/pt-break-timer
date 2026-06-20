/*
    * Storage module for persisting timer settings, timer state, and exercise states in localStorage.
    * Written by James Hutchings and ChatGPT, 2024-06-19
*/

import { ExerciseState, TimerSettings, TimerState } from "./types";

// Keys for localStorage
const TIMER_SETTINGS_KEY = "pt-break-timer:timer-settings";
const TIMER_STATE_KEY = "pt-break-timer:timer-state";
const EXERCISE_STATES_KEY = "pt-break-timer:exercise-states";

// Default timerSettings and presets.
const defaultTimerSettings: TimerSettings = {
    intervalMinutes: 30,
    exercisesPerBreak: 2,
      presets: [
    {
      id: "quick",
      label: "Quick Break",
      intervalMinutes: 15,
      exercisesPerBreak: 1,
    },
    {
      id: "standard",
      label: "Standard Break",
      intervalMinutes: 30,
      exercisesPerBreak: 2,
    },
    {
      id: "long",
      label: "Long Break",
      intervalMinutes: 45,
      exercisesPerBreak: 3,
    },
  ],
};

// Default timerState, with no active break.
const defaultTimerState: TimerState = {
    endAt: null,
};

// Function to get timer settings from localStorage, or return default if not found or invalid.
function safeParse<T>(value: string | null): T | null {
    if (!value) {
        return null;
    }

    // Attempt to prasee JSON string.
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

// Load timer settings from localStorage, or return default if not found or invalid.
export function loadTimerSettings(): TimerSettings {
    const parsed = safeParse<TimerSettings>(localStorage.getItem(TIMER_SETTINGS_KEY));
    return parsed ?? defaultTimerSettings;
}

// Save timer settings to localStorage.
export function saveTimerSettings(settings: TimerSettings): void {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(settings));
}

// Load timer state from localStorage, or return default if not found or invalid.
export function loadTimerState(): TimerState {
    const parsed = safeParse<TimerState>(localStorage.getItem(TIMER_STATE_KEY));
    return parsed ?? defaultTimerState;
}

// Save timer state to localStorage.
export function saveTimerState(state: TimerState): void {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
}

// Load exercise states from localStorage, or return empty array if not found or invalid.
export function loadExerciseStates(): ExerciseState[] {
    const parsed = safeParse<ExerciseState[]>(localStorage.getItem(EXERCISE_STATES_KEY));
    return parsed ?? [];
}

// Save exercise states to localStorage.
export function saveExerciseStates(states: ExerciseState[]): void {
    localStorage.setItem(EXERCISE_STATES_KEY, JSON.stringify(states));
}

// Clear all related localStorage items (for testing or reset purposes).
export function clearAllStorage(): void {
    localStorage.removeItem(TIMER_SETTINGS_KEY);
    localStorage.removeItem(TIMER_STATE_KEY);
    localStorage.removeItem(EXERCISE_STATES_KEY);
}
