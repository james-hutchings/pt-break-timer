/*
types.ts
This file contains the type definitions for the application. 
Written by James Hutchings, 2024-06-01
*/

// Type exercise, represents an individual exercise that a user will complete during a PT break.
export type Exercise = {
    id: string;
    name: string;
    type: string;
    area: string;
    bodyPart: string;
    instructions: string;
    durationSeconds: number;
    sets?: number | null;
    reps?: number | null;
    videoUrl?: string | null;
    active: boolean;
};


// Type ExerciseState, represents the state of the exercise, it's ID, when it was last done, and times done.
export type ExerciseState = {
    exerciseId: string;
    lastDoneAt: string | null;
    timesDone: number;
};

// Type TimerPreset, represents a PRESET for the timer, including its ID, label, interval in minutes, and how many exercises per break.
export type TimerPreset = {
    id: string;
    label: string;
    intervalMinutes: number;
    exercisesPerBreak: number;
};

// Type TimerSettings, represents the CURRENT settings for the timer, including the interval in minutes, how many exercises per break, and an array of presets.
export type TimerSettings = {
    intervalMinutes: number;
    exercisesPerBreak: number;
    presets: TimerPreset[];
};

// Type TimerState, represents the STATE of the timer. Just holds the end time of the current break. 
export type TimerState = {
    endAt: string | null;
};

