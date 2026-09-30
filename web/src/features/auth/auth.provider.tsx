import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import {
  clearStudentSession,
  clearWorkoutProgressStorage,
  getStudentSession,
  persistStudentSession,
} from '../../services/storage/session-storage'
import type { StudentSession } from './auth.dto'
import { AuthContext } from './auth.hook'
import type { AuthContextValue } from './auth.hook'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<StudentSession | null>(getStudentSession)

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn(nextSession) {
        persistStudentSession(nextSession)
        setSession(nextSession)
      },
      signOut() {
        if (session) {
          clearWorkoutProgressStorage(session.enrollmentCode)
        }
        clearStudentSession()
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
