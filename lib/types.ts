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
    active: boolean;
};


// Type ExerciseState, represents the state of the exercise, it's ID, when it was last done, and times done.
export type ExerciseState = {
    exerciseId: string;
    lastDoneAt: Date | null;
    timesDone: number;
};

// Type TimerSettings, represents the settings for the timer, including how long the break is, and how many exercises per break.
export type TimerSettings = {
    intervalMinutes: number;
    exercisesPerBreak: number;
};