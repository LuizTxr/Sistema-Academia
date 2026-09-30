import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/auth.hook'
import { paths } from './paths'

export function ProtectedRoute() {
  const { session } = useAuth()

  return session ? <Outlet /> : <Navigate to={paths.aluno.login} replace />
}

export function GuestRoute() {
  const { session } = useAuth()

  return session ? <Navigate to={paths.aluno.treino} replace /> : <Outlet />
}
