/*
  * This file contains unit tests for the timer functions defined in timer.ts.
  * Written by James Hutchings and ChatGPT, 2024-06-19
*/

import { describe, it, expect } from "vitest";

import type { TimerState } from "../lib/types";
import { getRemainingSeconds, isTimerComplete, resetTimer, snoozeTimer, startTimer } from "../lib/timer";

describe("startTimer", () => {
  
  // Test for startTimer function, checks if it sets the endAt property correctly based on the interval.
  it("startTimer sets endAt correctly based on the interval", () => {
    
    const now = new Date("2026-06-16T21:42:50.762Z");
    const timerState = startTimer(30, now);

    expect(timerState.endAt).toBe("2026-06-16T22:12:50.762Z");
  });
});

describe("getRemainingSeconds", () => {

  // Test for getRemainingSeconds function, checks if it returns the correct number of seconds remaining until the timer ends.
  it("getRemainingSeconds returns correct seconds remaining", () => {
    
    const now = new Date("2026-06-16T21:42:50.762Z");
    const endAt = "2026-06-16T21:43:20.762Z";

    const remainingSeconds = getRemainingSeconds(endAt, now);
    expect(remainingSeconds).toBe(30); // 30 seconds
  });

  // Test for getRemainingSeconds function, checks if it returns 0 when the timer has expired.
  it("getRemainingSeconds returns 0 when the timer has expired", () => {

    const now = new Date("2026-06-16T21:42:50.762Z");
    const endAt = "2026-06-16T21:42:40.762Z";

    const result = getRemainingSeconds(endAt, now);

    expect(result).toBe(0);
  });

  it("getRemainingSeconds returns 0 when endAt is null", () => {

      const now = new Date("2026-06-16T21:42:50.762Z");

    expect(getRemainingSeconds(null, now)).toBe(0);
  });
});

describe("isTimerComplete", () => {
  // Test for isTimerComplete function, checks if it returns true when the timer has expired.
  it ("isTimerComplete returns true when the timer has expired", () => {

    const now = new Date("2026-06-16T21:42:50.762Z");
    const endAt = "2026-06-16T21:42:40.762Z";

    expect(isTimerComplete(endAt, now)).toBe(true);
  });

  // Test for isTimerComplete function, checks if it returns false when the timer is still running.
  it("isTimerComplete returns false when the timer is still running", () => {

    const now = new Date("2026-06-16T21:42:50.762Z");
    const endAt = "2026-06-16T21:43:40.762Z";

    expect(isTimerComplete(endAt, now)).toBe(false);
  });
});

describe("resetTimer", () => {
  // Test for resetTimer function, checks if it resets the timer state correctly by setting endAt to null.
  it("resetTimer clears the timer", () => {

    const result = resetTimer();

    expect(result).toEqual({ endAt: null });
  });
});

describe("snoozeTimer", () => {
  // Test for snoozeTimer function, checks if it extends the timer correctly when the timer is still running.
  it("snoozeTimer extends from the existing end time when the timer is still running", () => {

    const now = new Date("2026-06-16T21:42:50.762Z");
    const timerState: TimerState = {endAt: "2026-06-16T21:43:20.762Z",};

    const result = snoozeTimer(timerState, 5, now);

    expect(result).toEqual({endAt: "2026-06-16T21:48:20.762Z",});
  });

  it("snoozeTimer extends from now when the timer has already expired", () => {

    const now = new Date("2026-06-16T21:42:50.762Z");
    const timerState: TimerState = {
      endAt: "2026-06-16T21:42:40.762Z",
    };

    const result = snoozeTimer(timerState, 5, now);

    expect(result).toEqual({endAt: "2026-06-16T21:47:50.762Z",});
  });
});