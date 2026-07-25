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
      id: "test",
      label: "1 minute",
      intervalMinutes: 1,
      exercisesPerBreak: 1,
    },
    {
      id: "quick",
      label: "15 minutes",
      intervalMinutes: 15,
      exercisesPerBreak: 1,
    },
    {
      id: "standard",
      label: "30 minutes",
      intervalMinutes: 30,
      exercisesPerBreak: 2,
    },
    {
      id: "long",
      label: "45 minutes",
      intervalMinutes: 45,
      exercisesPerBreak: 3,
    },

        {
      id: "extended",
      label: "60 minutes",
      intervalMinutes: 60,
      exercisesPerBreak: 4,
    },
  ],
};

// Default timerState, with no active break.
const defaultTimerState: TimerState = {
    endAt: null,
};

// Function to attempt to parse data, or return failure.
function safeParse<T>(value: string | null): T | null {
    if (!value) {
        return null;
    }

    // Attempt to parse JSON string.
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

// Load timer settings from storage, or return default if not found or invalid.
export function loadTimerSettings(): TimerSettings {
    const storage = getStorage();

    if (!storage) {
        return defaultTimerSettings;
    }

    const parsed = safeParse<TimerSettings>(storage.getItem(TIMER_SETTINGS_KEY));
    return parsed ?? defaultTimerSettings;
}

// Save timer settings to storage.
export function saveTimerSettings(settings: TimerSettings): void {
    const storage = getStorage();
    if (!storage) return;

    storage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(settings));
}

// Load timer state from storage, or return default if not found or invalid.
export function loadTimerState(): TimerState {
    const storage = getStorage();

    if (!storage) {
        return defaultTimerState;
    }

    const parsed = safeParse<TimerState>(storage.getItem(TIMER_STATE_KEY));
    return parsed ?? defaultTimerState;
}

// Save timer state to storage.
export function saveTimerState(state: TimerState): void {
    const storage = getStorage();
    if (!storage) return;

    storage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
}

// Load exercise states from storage, or return empty array if not found or invalid.
export function loadExerciseStates(): ExerciseState[] {
    const storage = getStorage();

    if (!storage) {
        return [];
    }

    const parsed = safeParse<ExerciseState[]>(storage.getItem(EXERCISE_STATES_KEY));
    return parsed ?? [];
}

// Save exercise states to storage.
export function saveExerciseStates(states: ExerciseState[]): void {
    const storage = getStorage();
    if (!storage) return;

    storage.setItem(EXERCISE_STATES_KEY, JSON.stringify(states));
}

// Returns the storage. 
function getStorage(): Storage | null {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage;
}


// Clear all related storage items (for testing or reset purposes).
export function clearAllStorage(): void {
        
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(TIMER_SETTINGS_KEY);
    storage.removeItem(TIMER_STATE_KEY);
    storage.removeItem(EXERCISE_STATES_KEY);
}
