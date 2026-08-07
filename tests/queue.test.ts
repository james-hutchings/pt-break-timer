/*
Tests for the queue module, which contains the logic for managing the exercise queue and state.
Written by James Hutchings, 2026-08-06
*/

import { describe, expect, it } from "vitest";

import type { Exercise, ExerciseState } from "../lib/types";
import {
  getExerciseOptions,
  markExerciseDone,
  markExercisesDone,
} from "../lib/queue";

const exercises: Exercise[] = [
  {
    id: "a",
    name: "a",
    type: "a",
    area: "a",
    bodyPart: "a",
    instructions: "a",
    durationSeconds: 1,
    active: true,
    mode: "timer",
  },
  {
    id: "b",
    name: "b",
    type: "b",
    area: "b",
    bodyPart: "b",
    instructions: "b",
    durationSeconds: 2,
    active: true,
    mode: "timer",
  },
  {
    id: "c",
    name: "c",
    type: "c",
    area: "c",
    bodyPart: "c",
    instructions: "c",
    durationSeconds: 3,
    active: true,
    mode: "timer",
  },
  {
    id: "d",
    name: "d",
    type: "d",
    area: "d",
    bodyPart: "d",
    instructions: "d",
    durationSeconds: 4,
    active: true,
    mode: "timer",
  },
  {
    id: "e",
    name: "e",
    type: "e",
    area: "e",
    bodyPart: "e",
    instructions: "e",
    durationSeconds: 5,
    active: true,
    mode: "timer",
  },
  {
    id: "f",
    name: "f",
    type: "f",
    area: "f",
    bodyPart: "f",
    instructions: "f",
    durationSeconds: 6,
    active: true,
    mode: "timer",
  },
  {
    id: "g",
    name: "g",
    type: "g",
    area: "g",
    bodyPart: "g",
    instructions: "g",
    durationSeconds: 7,
    active: true,
    mode: "timer",
  },
  {
    id: "h",
    name: "h",
    type: "h",
    area: "h",
    bodyPart: "h",
    instructions: "h",
    durationSeconds: 8,
    active: true,
    mode: "timer",
  },
  {
    id: "i",
    name: "i",
    type: "i",
    area: "i",
    bodyPart: "i",
    instructions: "i",
    durationSeconds: 9,
    active: true,
    mode: "timer",
  },
  {
    id: "j",
    name: "j",
    type: "j",
    area: "j",
    bodyPart: "j",
    instructions: "j",
    durationSeconds: 10,
    active: true,
    mode: "timer",
  },
];

/*
Tests for the queue module.
*/

// Tests for getExerciseOptions function.
describe("getExerciseOptions", () => {

    // Test 1: Test getExerciseOptions returns 2N exercises.
    it("should return 2N exercises", () => {
    const result = getExerciseOptions(exercises, [], 2);

    expect(result.length).toBe(4);
  });

    // Test 2: Test getExerciseOptions excludes inactive exercises.
    it("excludes inactive exercises", () => {
        const modifiedExercises = [...exercises];
        modifiedExercises[0] = {...modifiedExercises[0], active: false };

        const result = getExerciseOptions(modifiedExercises, [], 2);

        expect(result.some((exercise) => exercise.id === "a")).toBe(false);
    });

    // Test 3: Test getExerciseOptions prioritizes exercises with no state, in no particular order.
    it("prioritizes exercises with no state", () => {
        const states: ExerciseState[] = [
        {
            exerciseId: "a",
            lastDoneAt: "2026-01-03T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "b",
            lastDoneAt: "2026-01-01T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "c",
            lastDoneAt: "2026-01-02T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "d",
            lastDoneAt: "2026-01-04T00:00:00.000Z",
            timesDone: 1,
        },
        ];

        const result = getExerciseOptions(exercises, states, 5);
        expect(result.slice(0, 6).map((exercise) => exercise.id)).toEqual(["e", "f", "g", "h", "i", "j"]);
    });

        // Test 4: Test getExerciseOptions sorts completed exercises by oldest lastDoneAt first.
    it("sorts completed exercises by oldest lastDoneAt first", () => {
        const states: ExerciseState[] = [
        {
            exerciseId: "a",
            lastDoneAt: "2026-01-03T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "b",
            lastDoneAt: "2026-01-01T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "c",
            lastDoneAt: "2026-01-02T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "d",
            lastDoneAt: "2026-01-04T00:00:00.000Z",
            timesDone: 1,
        },
        ];

        // Accounts for all exercises. 
        const result = getExerciseOptions(exercises.slice(0,4), states, 2);
        expect(result.map((exercise) => exercise.id)).toEqual(["b", "c", "a", "d"]);
    });

});

// Tests for markExerciseDone function.

describe("markExerciseDone", () => {
    
    // Test 1: Test markExerciseDone creates a new state if one does not exist:
    it("creates a new state if one does not exist", () => {
        const now = new Date("2026-06-16T21:42:50.762Z");
        const result = markExerciseDone("a", [], now);
        expect(result).toEqual({
            exerciseId: "a",
            lastDoneAt: now.toISOString(),
            timesDone: 1,
        });
    });

    // Test 2: Test markExerciseDone increments timesDone when state exists:
    it("increments timesDone when state exists", () => {
        const now = new Date("2026-06-16T21:42:50.762Z");
        const existingState: ExerciseState = {
            exerciseId: "a",
            lastDoneAt: "2026-01-01T00:00:00.000Z",
            timesDone: 3,
        };
        const result = markExerciseDone("a", [existingState], now);
        expect(result.timesDone).toBe(4);
        expect(result.lastDoneAt).toBe(now.toISOString());
    });
});

describe("markExercisesDone", () => {

    // Test 1: Test markExercisesDone updates multiple exercises correctly.
    it("updates multiple exercise states", () => {
    const now = new Date("2026-06-16T21:42:50.762Z");

    const states: ExerciseState[] = [
        {
            exerciseId: "a",
            lastDoneAt: "2026-01-01T00:00:00.000Z",
            timesDone: 1,
        },
        {
            exerciseId: "b",
            lastDoneAt: "2026-01-02T00:00:00.000Z",
            timesDone: 2,
        },
        {
            exerciseId: "c",
            lastDoneAt: null,
            timesDone: 0,
        },
    ];

    const result = markExercisesDone(["a", "c"], states, now);

    expect(result).toEqual([
        {
            exerciseId: "a",
            lastDoneAt: now.toISOString(),
            timesDone: 2,
        },
        {
            exerciseId: "b",
            lastDoneAt: "2026-01-02T00:00:00.000Z",
            timesDone: 2,
        },
        {
            exerciseId: "c",
            lastDoneAt: now.toISOString(),
            timesDone: 1,
        },
    ]);
    });
});