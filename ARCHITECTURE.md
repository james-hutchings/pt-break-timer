# PT Break Timer

## Purpose

The PT Break Timer is a lightweight web application that reminds users to take periodic movement breaks throughout the day while ensuring that prescribed physical therapy exercises are completed evenly over time.

The application is intended to be modular, testable, and extensible, allowing future additions such as exercise statistics, video demonstrations, configurable workout modes, and cloud synchronization.

---

# Core User Flow

1. User starts the break timer.
2. Timer counts down.
3. Break begins.
4. Application generates `2N` exercise options.
5. User selects `N` exercises.
6. Exercise session begins.
7. Exercises are completed one at a time.
8. Exercise completion history is updated.
9. Timer resets for the next work period.

---

# Design Principles

The application follows a layered architecture.

```
UI Components
        ↓
React Hooks
        ↓
Business Logic
        ↓
Storage
```

Each layer has a single responsibility.

* Components display information.
* Hooks manage React state.
* Business logic contains application rules.
* Storage persists user data.

This separation makes future changes (such as replacing localStorage with a database) require minimal changes to the rest of the application.

---

# Data Types

## Exercise

Represents a single exercise available to the user.

Current fields:

* id
* name
* type
* area
* bodyPart
* instructions
* durationSeconds
* sets (optional)
* reps (optional)
* videoUrl (optional)
* active

---

## ExerciseState

Tracks user progress for an exercise.

Fields:

* exerciseId
* lastDoneAt
* timesDone

---

## TimerPreset

Represents a predefined timer configuration.

Fields:

* id
* label
* intervalMinutes
* exercisesPerBreak

---

## TimerSettings

Stores the user's current timer configuration.

Fields:

* intervalMinutes
* exercisesPerBreak
* presets

---

## TimerState

Stores the current timer state.

Fields:

* endAt

---

## ExerciseSession

Represents an active exercise session.

Fields:

* selectedExerciseIds
* currentIndex
* completedExerciseIds

---

# Queue Rules

Queue generation is handled by `queue.ts`.

Rules:

* Ignore inactive exercises.
* Exercises never completed have highest priority.
* Remaining exercises are ordered by oldest completion date.
* Display `2N` exercises.
* User selects `N` exercises.
* Selected exercises become an Exercise Session.

---

# Exercise Session Flow

Exercise execution is intentionally separated from exercise selection.

Selection:

```
Queue
↓
User chooses exercises
```

Execution:

```
Selected exercises
↓
Exercise Session
↓
One exercise displayed at a time
↓
Completion updates ExerciseState
```

This architecture allows future support for:

* Sets
* Repetitions
* Hold timers
* Exercise-specific workflows
* Different completion modes

without changing queue logic.

---

# Timer Rules

Timer logic lives in `timer.ts`.

Rules:

* Timer stores an end time.
* Remaining time is calculated from the end time.
* Timer can:

  * Start
  * Reset
  * Snooze
* React ticking behavior is handled by `useTimer.ts`.

---

# Storage

Current implementation uses browser `localStorage`.

Stored:

* TimerSettings
* TimerState
* ExerciseState[]

Not stored:

* Exercise definitions
* Default timer presets

Storage is isolated inside `storage.ts`.

This abstraction allows future replacement with:

* IndexedDB
* REST API
* Database
* Cloud synchronization

without affecting business logic.

---

# Folder Structure

```text
app/
components/
data/
hooks/
lib/
tests/
```

---

# Current Components

## lib/

* types.ts
* queue.ts
* timer.ts
* storage.ts
* exerciseSession.ts

## hooks/

* useTimer.ts

## components/

* Timer.tsx
* ExerciseQueue.tsx
* ExerciseRunner.tsx

---

# Testing

Current coverage includes:

## Queue

* Returns correct exercise count
* Filters inactive exercises
* Prioritizes never-completed exercises
* Orders completed exercises by recency
* Updates ExerciseState
* Updates multiple ExerciseStates

## Timer

* Starts correctly
* Calculates remaining time
* Detects completion
* Resets correctly
* Snoozes correctly

---

# Current Implementation Status

## Completed

* Project initialized
* GitHub integration
* Queue architecture
* Queue implementation
* Queue tests
* Timer architecture
* Timer implementation
* Timer tests
* Storage layer
* Exercise session architecture
* React timer hook
* Exercise selection flow
* Exercise runner
* Exercise completion persistence
* Timer settings loaded from storage
* Working browser UI

---

# Remaining for V1

## Functional

* Convert exercise spreadsheet into `exercises.json`
* Verify queue updates correctly over multiple sessions
* Settings UI for timer presets
* Remove temporary development controls

## UI / UX

* Improve exercise cards
* Improve selection experience
* Better spacing and visual polish
* Mobile responsiveness

## Deployment

* Production build
* Deploy 
* Final testing
* Remove development-only debugging

---

# Planned V2+

* Exercise statistics page
* Exercise history dashboard
* Custom timer presets
* Video playback
* Sets / reps / hold workflows
* Better exercise metadata
* Cloud synchronization
* User accounts
* Multi-device support

---

# Development Notes

Temporary debugging for exercise history can be added to `Timer.tsx` by rendering the current `ExerciseState[]` beneath the timer. This should be removed before production deployment.


old Json:

// [
//   {
//     "id": "a",
//     "name": "a",
//     "type": "a",
//     "area": "a",
//     "bodyPart": "a",
//     "instructions": "a",
//     "durationSeconds": 1,
//     "active": true
//   },
//   {
//     "id": "b",
//     "name": "b",
//     "type": "b",
//     "area": "b",
//     "bodyPart": "b",
//     "instructions": "b",
//     "durationSeconds": 2,
//     "active": true
//   },
//   {
//     "id": "c",
//     "name": "c",
//     "type": "c",
//     "area": "c",
//     "bodyPart": "c",
//     "instructions": "c",
//     "durationSeconds": 3,
//     "active": true
//   },
//   {
//     "id": "d",
//     "name": "d",
//     "type": "d",
//     "area": "d",
//     "bodyPart": "d",
//     "instructions": "d",
//     "durationSeconds": 4,
//     "active": true
//   },
//   {
//     "id": "e",
//     "name": "e",
//     "type": "e",
//     "area": "e",
//     "bodyPart": "e",
//     "instructions": "e",
//     "durationSeconds": 5,
//     "active": true
//   },
//   {
//     "id": "f",
//     "name": "f",
//     "type": "f",
//     "area": "f",
//     "bodyPart": "f",
//     "instructions": "f",
//     "durationSeconds": 6,
//     "active": true
//   },
//   {
//     "id": "g",
//     "name": "g",
//     "type": "g",
//     "area": "g",
//     "bodyPart": "g",
//     "instructions": "g",
//     "durationSeconds": 7,
//     "active": true
//   },
//   {
//     "id": "h",
//     "name": "h",
//     "type": "h",
//     "area": "h",
//     "bodyPart": "h",
//     "instructions": "h",
//     "durationSeconds": 8,
//     "active": true
//   },
//   {
//     "id": "i",
//     "name": "i",
//     "type": "i",
//     "area": "i",
//     "bodyPart": "i",
//     "instructions": "i",
//     "durationSeconds": 9,
//     "active": true
//   },
//   {
//     "id": "j",
//     "name": "j",
//     "type": "j",
//     "area": "j",
//     "bodyPart": "j",
//     "instructions": "j",
//     "durationSeconds": 10,
//     "active": true
//   }
// ]

