import { AppProviders } from '../providers/AppProviders'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { WorkoutPage } from '../../features/workout/pages/WorkoutPage'
import { getStudentSession } from '../../services/storage/session-storage'

export function AppRouter() {
  const session = getStudentSession()

  return (
    <AppProviders>
      {session ? <WorkoutPage session={session} /> : <LoginPage />}
    </AppProviders>
  )
}
