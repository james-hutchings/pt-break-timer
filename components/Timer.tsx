
/*  This file contains a React component called Timer, which displays a countdown timer and provides controls to start and reset the timer.
* Written by James Hutchings and ChatGPT, 2024-06-19
*/

"use client";

import { useTimer } from "@/hooks/useTimer";

type TimerProps = {
    defaultIntervalMinutes?: number;
};

// Helper function to format remaining seconds into a MM:SS string format.
function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Timer component is a React component that displays a countdown timer and provides controls to start and reset the timer. 
// It uses the useTimer hook to manage the timer's state and behavior.
export function Timer({ defaultIntervalMinutes = 30 }: TimerProps) {
    const {
        remainingSeconds,
        isRunning,
        isComplete,
        start,
        reset,
    } = useTimer(defaultIntervalMinutes);

    // Render the timer UI, showing the remaining time, whether the timer is running or complete, and buttons to start and reset the timer.
    return (
        <div className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">PT Break Timer</h2>

            <div className="mt-4 text-5xl font-bold">
                {isComplete ? "Break Time!" : formatTime(remainingSeconds)}
            </div>

            <p className="mt-2 text-sm text-gray-600">
                {isRunning ? "Timer running" : "Timer stopped"}
            </p>

            <div className="mt-6 flex gap-3">
                <button
                    className="rounded-lg border px-4 py-2"
                    onClick={() => start(defaultIntervalMinutes)}
                >
                    Start
                </button>

                <button
                    className="rounded-lg border px-4 py-2"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}