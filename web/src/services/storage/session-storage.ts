import type { StudentSession } from '../../types/auth'
import type {
  WorkoutDraftByDay,
  WorkoutSavedStateByDay,
} from '../../features/workout/types/workout'

export const sessionStorageKeys = {
  studentSession: 'student-session',
  workoutDraftByDay: 'workout-draft-by-day',
  workoutSavedStateByDay: 'workout-saved-state-by-day',
}

export function getStudentSession() {
  const storedSession = window.localStorage.getItem(
    sessionStorageKeys.studentSession,
  )

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as StudentSession
  } catch {
    window.localStorage.removeItem(sessionStorageKeys.studentSession)
    return null
  }
}

export function persistStudentSession(session: StudentSession) {
  window.localStorage.setItem(
    sessionStorageKeys.studentSession,
    JSON.stringify(session),
  )
}

export function clearStudentSession() {
  window.localStorage.removeItem(sessionStorageKeys.studentSession)
}

function readJsonStorage<T>(storageKey: string) {
  const storedValue = window.localStorage.getItem(storageKey)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as T
  } catch {
    window.localStorage.removeItem(storageKey)
    return null
  }
}

export function getWorkoutDraftByDay() {
  return readJsonStorage<WorkoutDraftByDay>(
    sessionStorageKeys.workoutDraftByDay,
  )
}

export function persistWorkoutDraftByDay(draftByDay: WorkoutDraftByDay) {
  window.localStorage.setItem(
    sessionStorageKeys.workoutDraftByDay,
    JSON.stringify(draftByDay),
  )
}

export function getWorkoutSavedStateByDay() {
  return readJsonStorage<WorkoutSavedStateByDay>(
    sessionStorageKeys.workoutSavedStateByDay,
  )
}

export function persistWorkoutSavedStateByDay(
  savedStateByDay: WorkoutSavedStateByDay,
) {
  window.localStorage.setItem(
    sessionStorageKeys.workoutSavedStateByDay,
    JSON.stringify(savedStateByDay),
  )
}

export function clearWorkoutProgressStorage() {
  window.localStorage.removeItem(sessionStorageKeys.workoutDraftByDay)
  window.localStorage.removeItem(sessionStorageKeys.workoutSavedStateByDay)
}
