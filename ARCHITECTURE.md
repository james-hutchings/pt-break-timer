# PT Break Timer

## Purpose

Prompt users to take PT breaks and ensure exercises are performed evenly over time.

## Core Flow

1. Timer expires
2. Show 2N exercise options
3. User completes N exercises
4. Update exercise states
5. Restart timer

## Data Types

Exercise
ExerciseState
TimerSettings

## Queue Rules

- Active exercises only
- Never-done exercises first
- Then oldest completed exercises
- Show 2N options
- User selects N

## Storage

Current:
- Not implemented

Planned:
- localStorage

## Folder Structure

app/
components/
data/
lib/
tests/

## Key Functions

getExerciseOptions(...)
markExerciseDone(...)
markExercisesDone(...)