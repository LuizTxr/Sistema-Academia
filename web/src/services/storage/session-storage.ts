import type { StudentSession } from '../../types/auth'

export const sessionStorageKeys = {
  studentSession: 'student-session',
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
