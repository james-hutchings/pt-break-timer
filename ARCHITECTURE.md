# PT Break Timer

## Purpose

The PT Break Timer is a lightweight web application that reminds users to take periodic movement breaks throughout the day while ensuring prescribed physical therapy exercises are completed evenly over time.

The application is designed to be modular, testable, and extensible, allowing future additions such as exercise statistics, video demonstrations, configurable workout modes, cloud synchronization, and user accounts.

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

```text
UI Components
        ↓
React Hooks
        ↓
Business Logic
        ↓
Storage
```

Each layer has a single responsibility.

- Components display information.
- Hooks manage React state and browser behavior.
- Business logic contains application rules.
- Storage persists user data.

This separation allows implementation details (such as replacing `localStorage` with a database) to change without requiring major changes to the rest of the application.

---

# Data Types

## ExerciseMode

Determines how an exercise should be performed.

Current values:

- `timer`
- `reps`
- `hold`

---

## Exercise

Represents a single exercise available to the user.

Fields:

- `id`
- `name`
- `type`
- `area`
- `bodyPart`
- `instructions`
- `mode`
- `durationSeconds` *(optional)*
- `reps` *(optional)*
- `holdSeconds` *(optional)*
- `videoUrl` *(optional)*
- `active`

---

## ExerciseState

Tracks user history for an exercise.

Fields:

- `exerciseId`
- `lastDoneAt`
- `timesDone`

---

## TimerPreset

Represents one preset timer configuration.

Fields:

- `id`
- `label`
- `intervalMinutes`
- `exercisesPerBreak`

---

## TimerSettings

Stores the user's timer configuration.

Fields:

- `intervalMinutes`
- `exercisesPerBreak`
- `presets`

---

## TimerState

Tracks the current timer.

Fields:

- `endAt`

---

## ExerciseSession

Tracks the user's current exercise session.

Fields:

- `selectedExerciseIds`
- `currentIndex`
- `completedExerciseIds`

---

# Exercise Model

Exercises are stored as application content rather than user state.

Spreadsheet mapping:

| Spreadsheet | Exercise |
|-------------|----------|
| Exercise | `name` |
| Type | `type` |
| Area | `area` |
| Body Part | `bodyPart` |
| How | `instructions` |
| Video Link | `videoUrl` |
| Include | `active` |

Exercise prescriptions are interpreted as:

### Timer Exercise

```text
Mode: timer
Uses durationSeconds
```

### Rep Exercise

```text
Mode: reps
Uses reps
```

### Hold Exercise

```text
Mode: hold
Uses holdSeconds
```

Unused spreadsheet fields are ignored for V1.

---

# Queue Rules

Queue generation is handled entirely by `queue.ts`.

Rules:

- Ignore inactive exercises.
- Prioritize exercises never completed.
- Then prioritize oldest completed exercises.
- Generate `2N` exercise options.
- User selects `N`.
- Selected exercises become an `ExerciseSession`.

---

# Exercise Session Flow

Exercise execution is intentionally separated from exercise selection.

Selection:

```text
Queue
↓
User selects exercises
```

Execution:

```text
Selected exercises
↓
Exercise Session
↓
Display one exercise
↓
User completes exercise
↓
Update ExerciseState
↓
Next exercise
```

This architecture supports future additions such as:

- Hold timers
- Repetition counters
- Exercise-specific workflows
- Different completion methods

without modifying queue logic.

---

# Timer Rules

Timer logic is implemented in `timer.ts`.

Rules:

- Timer stores an end time.
- Remaining time is calculated from the current time.
- Timer can:
  - Start
  - Reset
  - Snooze

React timing behavior is handled by `useTimer.ts`.

Timer presets determine:

- Break duration
- Number of exercises per break

---

# Storage

Current implementation uses browser `localStorage`.

Stored:

- `TimerSettings`
- `TimerState`
- `ExerciseState[]`

Not stored:

- Exercise definitions
- Default timer presets

Storage is isolated inside `storage.ts`.

Future storage implementations could include:

- IndexedDB
- REST API
- SQL / NoSQL database
- Cloud synchronization

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

- `types.ts`
- `queue.ts`
- `timer.ts`
- `storage.ts`
- `exerciseSession.ts`

## hooks/

- `useTimer.ts`

## components/

- `Timer.tsx`
- `ExerciseQueue.tsx`
- `ExerciseRunner.tsx`

---

# Testing

## Queue

Current tests verify:

- Correct exercise count
- Active exercise filtering
- Never-completed prioritization
- Completion ordering
- Single exercise updates
- Multiple exercise updates

## Timer

Current tests verify:

- Timer starts correctly
- Remaining time calculation
- Completion detection
- Reset
- Snooze

---

# Current Implementation Status

## Completed

- Project initialized
- GitHub integration
- Queue architecture
- Queue implementation
- Queue unit tests
- Timer architecture
- Timer implementation
- Timer unit tests
- Storage layer
- Exercise session architecture
- React timer hook
- Exercise selection workflow
- Exercise runner
- Exercise completion persistence
- Timer preset selection
- Working browser UI
- Spreadsheet converted into application JSON
- Mode-based exercise model
- Video demonstration button support

---

# Remaining for V1

## Functional

- Verify queue behavior across multiple completed sessions
- Final review of generated exercise JSON
- Lock timer preset during active break
- Remove development helpers

## UI / UX

- Improve exercise cards
- Improve exercise selection UX
- Polish spacing and typography
- Mobile responsiveness
- Optional completion sound

## Deployment

- Production build
- Deploy application
- Final testing
- Remove debugging utilities

---

# Planned V2+

- Exercise statistics page
- Exercise history dashboard
- Custom timer presets
- Embedded exercise videos
- Better exercise metadata
- Cloud synchronization
- User accounts
- Multi-device support

---

# Development Notes

Temporary debugging can be added by rendering `ExerciseState[]` inside `Timer.tsx`.

Remove all temporary debugging before production deployment.

Current deployment target is a static hosted web application using browser `localStorage` for persistence.