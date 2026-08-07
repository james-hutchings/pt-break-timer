/*
Type ExerciseSession, represents an individual session post timer expiration and moves through given exercises.
Written by James Hutchings, 2026-08-06
*/

import type { ExerciseSession } from "./types";

// Initializes an ExerciseSession.
export function startExerciseSession (selectedExerciseIds: string[]): ExerciseSession {
    return {
        selectedExerciseIds,
        currentIndex: 0,
        completedExerciseIds: [],
    };
}

// Returns current exercise that the session is on.
export function getCurrentExerciseId(session: ExerciseSession): string | null {
    return session.selectedExerciseIds[session.currentIndex] ?? null;
}

// Advances to next exercise in section.
export function advanceExerciseSession(session: ExerciseSession): ExerciseSession {
    const currentExerciseId = getCurrentExerciseId(session);

    if (!currentExerciseId) {
        return session;
    }

    return {
        ...session,
        currentIndex: session.currentIndex + 1,
        completedExerciseIds: [
            ...session.completedExerciseIds,
            currentExerciseId,
        ],
    };
}

// Determines if ExerciseSession is complete.
export function isExerciseSessionComplete(
    session: ExerciseSession
): boolean {
    return session.currentIndex >= session.selectedExerciseIds.length;
}


