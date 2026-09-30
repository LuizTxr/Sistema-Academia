import { createContext, useContext } from 'react'
import type { StudentSession } from './auth.dto'

export type AuthContextValue = {
  session: StudentSession | null
  signIn: (session: StudentSession) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return context
}
