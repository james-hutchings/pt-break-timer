/*

*/

import type { Exercise } from "@/lib/types";

type ExerciseRunnerProps = {
    exercise: Exercise;
    currentStep: number;
    totalSteps: number;
    onAdvance: () => void;
};

export function ExerciseRunner({
    exercise,
    currentStep,
    totalSteps,
    onAdvance,
}: ExerciseRunnerProps) {
    return (
        <div className="mt-6 rounded-2xl border p-4">
            <div className="text-sm text-gray-500">
                Exercise {currentStep} of {totalSteps}
            </div>

            <h3 className="mt-2 text-2xl font-semibold">{exercise.name}</h3>

            <div className="mt-2 text-sm text-gray-600">
                {exercise.type} · {exercise.area} · {exercise.bodyPart}
            </div>

            <p className="mt-4 text-base">{exercise.instructions}</p>

            <div className="mt-4 text-sm text-gray-500">
                Duration: {exercise.durationSeconds} seconds
            </div>

            <button
                className="mt-6 rounded-lg border px-4 py-2 text-sm font-medium"
                onClick={onAdvance}
            >
                Complete / Next
            </button>
        </div>
    );
}