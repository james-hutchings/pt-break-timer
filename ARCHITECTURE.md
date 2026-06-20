# PT Break Timer

## Purpose

Prompt users to take PT breaks and ensure exercises are performed evenly over time.

## Core Flow

1. Timer runs.
2. Timer expires.
3. Show 2N exercise options.
4. User completes N exercises.
5. Update exercise states.
6. Restart timer.

## Data Types

- Exercise
- ExerciseState
- TimerSettings
- TimerPreset
- TimerState

## Exercise Model

Exercises are stored as application content, not user state.

Current fields:

- id
- name
- type
- area
- bodyPart
- instructions
- durationSeconds
- sets (optional)
- reps (optional)
- videoUrl (optional)
- active

## Queue Rules

- Active exercises only
- Never-done exercises first
- Then oldest completed exercises
- Show 2N options
- User selects N

## Timer Rules

- Timer stores an end time
- Remaining time is calculated from end time and current time
- Timer can be started, reset, and snoozed
- Timer uses pure logic in `timer.ts`
- React state and ticking behavior live in `useTimer.ts`

## Storage

Current:
- `localStorage`

Stored data:
- `TimerSettings`
- `TimerState`
- `ExerciseState[]`

Not stored:
- Exercise definitions
- Default timer presets

## Folder Structure

```text
app/
components/
data/
hooks/
lib/
tests/

Completed. 

Current Implementation Status

Completed:

Project initialized
Queue logic implemented
Queue tests passing
Timer logic implemented
Timer tests passing
Storage wrapper implemented
React timer hook implemented
Timer UI working in the browser

Next:

Show exercise options when timer completes
Connect queue logic to the UI
Load exercise data from the spreadsheet or imported exercise file