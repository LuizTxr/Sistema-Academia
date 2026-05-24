import type { StudentSession } from '../../types/auth'
import type {
  WorkoutDraftByDay,
  WorkoutSavedStateByDay,
} from '../../features/workout/types/workout'

export const sessionStorageKeys = {
  studentSession: 'student-session',
  workoutDraftByDayPrefix: 'workout-draft-by-day',
  workoutSavedStateByDayPrefix: 'workout-saved-state-by-day',
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

function buildStudentScopedStorageKey(prefix: string, enrollmentCode: string) {
  return `${prefix}:${enrollmentCode}`
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

export function getWorkoutDraftByDay(enrollmentCode: string) {
  return readJsonStorage<WorkoutDraftByDay>(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutDraftByDayPrefix,
      enrollmentCode,
    ),
  )
}

export function persistWorkoutDraftByDay(
  enrollmentCode: string,
  draftByDay: WorkoutDraftByDay,
) {
  window.localStorage.setItem(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutDraftByDayPrefix,
      enrollmentCode,
    ),
    JSON.stringify(draftByDay),
  )
}

export function getWorkoutSavedStateByDay(enrollmentCode: string) {
  return readJsonStorage<WorkoutSavedStateByDay>(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutSavedStateByDayPrefix,
      enrollmentCode,
    ),
  )
}

export function persistWorkoutSavedStateByDay(
  enrollmentCode: string,
  savedStateByDay: WorkoutSavedStateByDay,
) {
  window.localStorage.setItem(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutSavedStateByDayPrefix,
      enrollmentCode,
    ),
    JSON.stringify(savedStateByDay),
  )
}

export function clearWorkoutProgressStorage(enrollmentCode: string) {
  window.localStorage.removeItem(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutDraftByDayPrefix,
      enrollmentCode,
    ),
  )
  window.localStorage.removeItem(
    buildStudentScopedStorageKey(
      sessionStorageKeys.workoutSavedStateByDayPrefix,
      enrollmentCode,
    ),
  )
}
