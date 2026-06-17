/*
Queue management for exercises. This module provides functions to determine the next exercise to perform based on the last time each exercise was done and the specified break time between exercises.
Written by James Hutchings, 2024-06-01
*/

import { Exercise, ExerciseState } from "./types";

/*
Function to get the last time an exercise was done, given its ID and the list of exercise states.
*/
function getLastDone(exerciseId: string, exerciseStates: ExerciseState[]): number {
    
    const state = exerciseStates.find(state => state.exerciseId === exerciseId);
    
    // Case where the exercise has never been done before, or there is no state for it, return 0 to indicate it can be done immediately.
    if (!state || !state.lastDoneAt) {
        return 0;
    }

    // Return the timestamp of when the exercise was last done.
    return new Date(state.lastDoneAt).getTime();
}

/*
Function to sort exercises by recency, with the oldest last done time first. This helps to ensure that exercises that haven't been done recently are prioritized.
*/
function sortExercisesByRecency(exercises: Exercise[], exerciseStates: ExerciseState[]): Exercise[] {
    
    // Sort the exercises based on the last done time, with the oldest first. This allows us to prioritize exercises that haven't been done recently.
    return [...exercises].sort((a, b) => {
        const lastDoneA = getLastDone(a.id, exerciseStates);
        const lastDoneB = getLastDone(b.id, exerciseStates);
        return lastDoneA - lastDoneB; // Sort by oldest last done time first
    });
}

/*
Function to get the exercise options for the next break, based on the list of exercises, their states, and the required count of exercises for the break.
*/
export function getExerciseOptions(exercises: Exercise[], states: ExerciseState[], requiredCount: number): Exercise[] {
    
    // Filter out inactive exercises, as they should not be included in the options.
    const activeExercises = exercises.filter(exercise => exercise.active);

    // Sort the active exercises by recency. Calls the sortExercisesByRecency function.
    const sortedExercises = sortExercisesByRecency(activeExercises, states);

    // Return the specified number of exercises multiplied by 2 to provide a buffer of options, ensuring that there are enough exercises to choose from even if some have been done recently.
    return sortedExercises.slice(0, requiredCount * 2);
}

/*  
This function takes the exercise ID, the current list of exercise states, and the current time, and returns the updated state for the exercise.
*/
export function markExerciseDone(exerciseId: string, states: ExerciseState[], now: Date): ExerciseState {
    
    // Convert the current time to an ISO string format for storage in the state.
    const nowString = now.toISOString();
    const existingState = states.find(state => state.exerciseId === exerciseId);

    // If no existing state is found, create a new one with timesDone set to 1. Otherwise, update the existing state by incrementing timesDone and updating lastDoneAt.
    if (!existingState) {
        // If no existing state is found, create a new one.
        return { exerciseId, lastDoneAt: nowString, timesDone: 1 };
    }

    return {        exerciseId,
        lastDoneAt: nowString,
        timesDone: existingState.timesDone + 1
    };
}

export function markExercisesDone(exerciseIds: string[], states: ExerciseState[], now: Date): ExerciseState[] {

    const updatedStates = [...states];

    for (const exerciseId of exerciseIds) {
        const updatedState = markExerciseDone(exerciseId, updatedStates, now);
        const index = updatedStates.findIndex(state => state.exerciseId === exerciseId);
    
    
        if (index === -1) {
            // If the exercise state doesn't exist, add it to the list of states.
            updatedStates.push(updatedState);
        } else {
            // If the exercise state exists, update it in the list of states.
            updatedStates[index] = updatedState;
        }
    }

    return updatedStates;
}
