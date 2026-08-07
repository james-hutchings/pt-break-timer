/*
 * This file contains a React component called Timer, which displays a countdown timer and provides controls to start and reset the timer.
 * Written by James Hutchings, 2026-08-06
 */

"use client";

import { useEffect, useRef, useState } from "react";
import exercisesData from "@/data/exercises.json";
import { ExerciseQueue } from "@/components/ExerciseQueue";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { useTimer } from "@/hooks/useTimer";
import { getExerciseOptions, markExercisesDone } from "@/lib/queue";
import {
    loadExerciseStates,
    loadTimerSettings,
    saveExerciseStates,
} from "@/lib/storage";
import {
    advanceExerciseSession,
    getCurrentExerciseId,
    isExerciseSessionComplete,
    startExerciseSession,
} from "@/lib/exerciseSession";
import type {
    Exercise,
    ExerciseSession,
    ExerciseState,
    TimerSettings,
} from "@/lib/types";

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
export function Timer(_: TimerProps) {
    const [timerSettings] = useState<TimerSettings>(loadTimerSettings);

    const alarmIntervalRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const [selectedPreset, setSelectedPreset] = useState(
        timerSettings.presets.find(
            (preset) =>
                preset.intervalMinutes === timerSettings.intervalMinutes &&
                preset.exercisesPerBreak === timerSettings.exercisesPerBreak,
        ) ?? timerSettings.presets[0],
    );

    const {
        timerState,
        remainingSeconds,
        isRunning,
        isComplete,
        start,
        reset,
        forceComplete,
    } = useTimer(selectedPreset.intervalMinutes);

    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
    const [session, setSession] = useState<ExerciseSession | null>(null);

    const [exerciseStates, setExerciseStates] = useState<ExerciseState[]>(() => {
        if (typeof window === "undefined") {
            return [];
        }

        return loadExerciseStates();
    });

    const exerciseOptions = getExerciseOptions(
        exercisesData as Exercise[],
        exerciseStates,
        selectedPreset.exercisesPerBreak,
    );

    const currentExerciseId = session ? getCurrentExerciseId(session) : null;
    const currentExercise = currentExerciseId
        ? (exerciseOptions.find((exercise) => exercise.id === currentExerciseId) ??
            null)
        : null;

    const uiPhase = session
        ? "session"
        : timerState.endAt === null
            ? "ready"
            : isComplete
                ? "selection"
                : "timer";

    // function for starting break.
    function handleStartBreak() {
        stopAlarm();
        setSelectedExerciseIds([]);
        setSession(null);
        start(selectedPreset.intervalMinutes);
    }

    // Function for resetting.
    function handleReset() {
        stopAlarm();
        setSelectedExerciseIds([]);
        setSession(null);
        reset();
    }

    // Function for forcing break time now.
    function handleSkipToBreakTime() {
        stopAlarm();
        setSelectedExerciseIds([]);
        setSession(null);
        forceComplete();
    }

    // Function handling toggling of exercise.
    function handleToggleExercise(exerciseId: string) {
        setSelectedExerciseIds((current) =>
            current.includes(exerciseId)
                ? current.filter((id) => id !== exerciseId)
                : [...current, exerciseId],
        );
    }

    function handleStartSelected() {
        if (selectedExerciseIds.length === 0) {
            return;
        }

        setSession(startExerciseSession(selectedExerciseIds));
    }

    function handleAdvanceSession() {
        if (!session || !currentExercise) {
            return;
        }

        const nextStates = markExercisesDone(
            [currentExercise.id],
            exerciseStates,
            new Date(),
        );

        setExerciseStates(nextStates);
        saveExerciseStates(nextStates);

        const nextSession = advanceExerciseSession(session);

        if (isExerciseSessionComplete(nextSession)) {
            stopAlarm();
            setSession(null);
            setSelectedExerciseIds([]);
            reset();
            return;
        }

        setSession(nextSession);
    }

    // Function for playing a beep sound.
    function beep() {
        if (typeof window === "undefined") {
            return;
        }

        // Check for AudioContext support in the browser
        const AudioContextClass =
            window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        // Create a new AudioContext if it doesn't exist
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextClass();
        }

        const context = audioContextRef.current;

        if (context.state === "suspended") {
            void context.resume();
        }

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "square";
        oscillator.frequency.value = 880;

        gain.gain.value = 0.1;

        oscillator.connect(gain);
        gain.connect(context.destination);

        const now = context.currentTime;

        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.25);
    }

    // Function for starting the alarm.
    function startAlarm() {
        if (alarmIntervalRef.current !== null) {
            return;
        }

        beep();
        alarmIntervalRef.current = window.setInterval(beep, 1000);
    }

    // Function for stopping the alarm.
    function stopAlarm() {
        if (alarmIntervalRef.current !== null) {
            window.clearInterval(alarmIntervalRef.current);
            alarmIntervalRef.current = null;
        }
    }

    useEffect(() => {
        if (timerState.endAt !== null && isComplete) {
            startAlarm();
        } else {
            stopAlarm();
        }

        return stopAlarm;
    }, [timerState.endAt, isComplete]);

    const displayText =
        uiPhase === "ready"
            ? "Ready to start"
            : uiPhase === "selection"
                ? "Break Time!"
                : uiPhase === "session"
                    ? "Exercise Time!"
                    : formatTime(remainingSeconds);

    return (
        <div className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">PT Break Timer</h2>

            <div className="mt-4 text-5xl font-bold">{displayText}</div>

            <div className="mt-4">
                <label className="mb-2 block text-md font-medium text-green-700">
                    Work Period
                </label>

                <select
                    className="rounded-lg border bg-white px-3 py-2 text-sm text-black"
                    value={selectedPreset.id}
                    onChange={(e) => {
                        const preset = timerSettings.presets.find(
                            (p) => p.id === e.target.value,
                        );

                        if (preset) {
                            setSelectedPreset(preset);
                        }
                    }}
                >
                    {timerSettings.presets.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                            {preset.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    className="rounded-lg border px-4 py-2"
                    onClick={handleStartBreak}
                >
                    Start
                </button>

                <button className="rounded-lg border px-4 py-2" onClick={handleReset}>
                    Reset
                </button>
                <button
                    className="rounded-lg border px-4 py-2"
                    onClick={handleSkipToBreakTime}
                >
                    End Timer and Start Break Now
                </button>

                {uiPhase === "selection" && (
                    <button
                        className="rounded-lg border px-4 py-2"
                        onClick={stopAlarm}
                    >
                        Silence Alarm
                    </button>
                )}
            </div>

            {uiPhase === "selection" && (
                <ExerciseQueue
                    exercises={exerciseOptions}
                    selectedExerciseIds={selectedExerciseIds}
                    onToggleSelect={handleToggleExercise}
                    onStartSelected={handleStartSelected}
                />
            )}

            {uiPhase === "session" && currentExercise && session && (
                <ExerciseRunner
                    exercise={currentExercise}
                    currentStep={session.currentIndex + 1}
                    totalSteps={session.selectedExerciseIds.length}
                    onAdvance={handleAdvanceSession}
                />
            )}
        </div>
    );
}
