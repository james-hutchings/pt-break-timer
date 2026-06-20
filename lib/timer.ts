/*
* pt-break-timer
* timer.ts
* This file contains the timer logic for the application. 
* Written by James Hutchings and ChatGPT, 2024-06-19
*/

import { TimerState } from "./types";

// addMinutes, a small helper function that adds a specific number of minutes to a given time.
function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

// startTimer, a function that starts the timer by calculating the end time based on the current time and the specified interval in minutes. 
// It returns a TimerState object with the calculated end time.
export function startTimer(intervalMinutes: number, now: Date): TimerState {
    return { endAt: addMinutes(now, intervalMinutes).toISOString() };
}

// getRemainingSeconds, a function that calculates the remaining seconds until the timer ends. 
// If the end time is null or has already passed, it returns 0.
export function getRemainingSeconds(endAt: string | null, now: Date): number {
    if (!endAt) {
        return 0;
    }

    // It takes the end time and the current time as parameters and returns the number of seconds left.
    const remainingMs = new Date(endAt).getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / 1000));
}

// isTimerComplete, a function that checks if the timer has completed.
export function isTimerComplete(endAt: string | null, now: Date): boolean {
    return getRemainingSeconds(endAt, now) === 0;
}

// resetTimer, a function that resets the timer by returning a TimerState object with the end time set to null.
export function resetTimer(): TimerState {
    return { endAt: null };
}

// snoozeTimer, a function that snoozes the timer by adding a specified number of minutes to the current end time.
export function snoozeTimer(timerState: TimerState, snoozeMinutes: number, now: Date): TimerState {
    const baseTime = timerState.endAt ? Math.max(new Date(timerState.endAt).getTime(), now.getTime()) : now.getTime();

    return {endAt: new Date(baseTime + snoozeMinutes * 60000).toISOString()};

}

