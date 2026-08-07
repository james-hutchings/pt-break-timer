/*
  * This file contains a custom React hook called useTimer, which manages the state and behavior of a timer.
  * Written by James Hutchings, 2026-08-06
 */

import { useEffect, useState } from "react";
import {
    getRemainingSeconds,
    isTimerComplete,
    resetTimer,
    snoozeTimer,
    startTimer,
} from "@/lib/timer";

import type { TimerState } from "@/lib/types";

// useTimer function is a custom React hook that manages the state and behavior of a timer. 
// It provides functionality to start, reset, and snooze the timer, as well as track the remaining time and whether the timer is complete.
export function useTimer(defaultIntervalMinutes = 30) {

    // Init constants.
    const [timerState, setTimerState] = useState<TimerState>(resetTimer());
    const [now, setNow] = useState<Date>(new Date());
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const remainingSeconds =
    getRemainingSeconds(
        timerState.endAt,
        now
    );

    const complete =
    isTimerComplete(
        timerState.endAt,
        now
    );

    // useEffect hook to manage the timer's countdown. It sets up an interval that updates the current time every second and checks if the timer is complete. 
    // If the timer is complete, it stops the timer.
    useEffect(() => {
        if (!isRunning || !timerState.endAt) {
            return;
        }

        const intervalID = window.setInterval(() => {
            const currentNow = new Date();
            setNow(currentNow);

            if (isTimerComplete(timerState.endAt, currentNow)) {
                setIsRunning(false);
            }
        }, 1000);

        return () => {
            window.clearInterval(intervalID);
        };
    }, [isRunning, timerState.endAt]);

    // Function to start the timer, it sets the timer state with a new end time based on the provided interval, updates the current time, and marks the timer as running.
    function start(intervalMinutes = defaultIntervalMinutes) {
        setTimerState(startTimer(intervalMinutes, new Date()));
        setNow(new Date());
        setIsRunning(true);
    }

    // Function to reset the timer, it clears the timer state, updates the current time, and marks the timer as not running.
    function reset() {
        setTimerState(resetTimer());
        setNow(new Date());
        setIsRunning(false);
    }

    // Function to snooze the timer, it extends the timer state by a specified number of minutes, updates the current time, and marks the timer as running.
    function snooze(minutes: number) {
        setTimerState((current) => snoozeTimer(current, minutes, new Date()));
        setNow(new Date());
        setIsRunning(true);
    }

    // Forces completion of break.
     function forceComplete() {
        const currentNow = new Date();
        setTimerState({
            endAt: currentNow.toISOString(),
        });
        setNow(currentNow);
        setIsRunning(false);
    }   

    // Returned values.
    return {
        timerState,
        remainingSeconds,
        isRunning,
        isComplete: complete,
        start,
        reset,
        snooze,
        forceComplete,
    };
}
