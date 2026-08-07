/*
 * Component that displays a list of exercises.
 * Written by James Hutchings, 2026-08-06
 */

import type { Exercise } from "@/lib/types";

type ExerciseQueueProps = {
    exercises: Exercise[];
    selectedExerciseIds: string[];
    onToggleSelect: (exerciseId: string) => void;
    onStartSelected: () => void;
};

function getExerciseSummary(exercise: Exercise): string {
    switch (exercise.mode) {
        case "timer":
            return `${exercise.durationSeconds ?? 0} seconds`;
        case "reps":
            return `${exercise.reps ?? 0} reps`;
        case "hold":
            return `${exercise.holdSeconds ?? 0} seconds hold`;
        default:
            return "Exercise";
    }
}

export function ExerciseQueue({
    exercises,
    selectedExerciseIds,
    onToggleSelect,
    onStartSelected,
}: ExerciseQueueProps) {
    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold">Choose exercises</h3>

            <div className="mt-3 space-y-2">
                {exercises.map((exercise) => {
                    const isSelected = selectedExerciseIds.includes(exercise.id);

                    return (
                        <div
                            key={exercise.id}
                            className={`rounded-lg border px-3 py-3 ${
                                isSelected ? "border-black" : ""
                            }`}
                        >
                            <div className="text-2xl font-semibold">{exercise.name}</div>

                            <div className="text-md text-sky-500">
                                {exercise.type} · {exercise.area} · {exercise.bodyPart}
                            </div>

                            <div className="mt-2 text-xl">
                                {exercise.instructions}
                            </div>

                            <div className="mt-2 text-md text-orange-500">
                                {getExerciseSummary(exercise)}
                            </div>

                            <button
                                className="mt-3 rounded-lg border px-3 py-2 text-sm"
                                onClick={() => onToggleSelect(exercise.id)}
                            >
                                {isSelected ? "Unselect" : "Select"}
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
                onClick={onStartSelected}
                disabled={selectedExerciseIds.length === 0}
            >
                Start Selected Exercises
            </button>            
        </div>
    );
}