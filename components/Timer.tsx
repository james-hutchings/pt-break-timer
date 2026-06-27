/*
 * This file contains a React component called Timer, which displays a countdown timer and provides controls to start and reset the timer.
 * Written by James Hutchings and ChatGPT, 2024-06-19
 */

"use client";

import { useState } from "react";
import exercisesData from "@/data/exercises.json";
import { ExerciseQueue } from "@/components/ExerciseQueue";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { useTimer } from "@/hooks/useTimer";
import { getExerciseOptions, markExercisesDone } from "@/lib/queue";
import { loadExerciseStates, saveExerciseStates } from "@/lib/storage";
import {
  advanceExerciseSession,
  getCurrentExerciseId,
  isExerciseSessionComplete,
  startExerciseSession,
} from "@/lib/exerciseSession";
import type { Exercise, ExerciseSession, ExerciseState } from "@/lib/types";

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
    timerState,
    remainingSeconds,
    isRunning,
    isComplete,
    start,
    reset,
    forceComplete,
  } = useTimer(defaultIntervalMinutes);

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
    2,
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
    setSelectedExerciseIds([]);
    setSession(null);
    start(defaultIntervalMinutes);
  }

  // Function for resetting.
  function handleReset() {
    setSelectedExerciseIds([]);
    setSession(null);
    reset();
  }

  // Function for forcing break time now.
  function handleSkipToBreakTime() {
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
      setSession(null);
      setSelectedExerciseIds([]);
      reset();
      return;
    }

    setSession(nextSession);
  }

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

      <p className="mt-2 text-sm text-gray-600">
        {isRunning ? "Timer running" : "Timer stopped"}
      </p>

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
          Begin Break Now
        </button>
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
