/*
Written by James Hutchings.
Component for running the exercises. 
*/

import type { Exercise } from "@/lib/types";

type ExerciseRunnerProps = {
    exercise: Exercise;
    currentStep: number;
    totalSteps: number;
    onAdvance: () => void;
};

function getExerciseDetails(exercise: Exercise): string {
    switch (exercise.mode) {
        case "timer":
            return `Duration: ${exercise.durationSeconds ?? 0} seconds`;

        case "reps":
            return `Reps: ${exercise.reps ?? 0}`;

        case "hold":
            return `Hold: ${exercise.holdSeconds ?? 0} seconds`;

        default:
            return "Exercise";
    }
}

export function ExerciseRunner({
    exercise,
    currentStep,
    totalSteps,
    onAdvance,
}: ExerciseRunnerProps) {
    return (
        <div className="mt-6 rounded-2xl border p-4">
            <div className="text-md text-orange-500">
                Exercise {currentStep} of {totalSteps}
            </div>

            <h3 className="mt-2 text-4xl font-semibold">{exercise.name}</h3>

            <div className="mt-2 text-md text-purple-700">
                {exercise.type} · {exercise.area} · {exercise.bodyPart}
            </div>

            <p className="mt-4 text-2xl">{"Instructions/Tips: " + exercise.instructions}</p>

            <div className="mt-4 text-md text-orange-500">
                {getExerciseDetails(exercise)}
            </div>

            <div className="mt-6">
                {exercise.videoUrl && (
                    <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg border px-3 py-2 text-sm font-medium"
                    >
                        ▶ View Exercise Demonstration
                    </a>
                )}
            </div>

            <div className="mt-6">
                <button
                    className="rounded-lg border px-4 py-2 text-sm font-medium"
                    onClick={onAdvance}
                >
                    Complete Exercise
                </button>
            </div>
        </div>
    );
}