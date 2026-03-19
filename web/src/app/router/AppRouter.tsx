import { LoginPage } from '../../features/auth/pages/LoginPage'
import { AppProviders } from '../providers/AppProviders'

export function AppRouter() {
  return (
    <AppProviders>
      <LoginPage />
    </AppProviders>
  )
}
