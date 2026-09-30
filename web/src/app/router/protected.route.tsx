import { Navigate, Outlet } from 'react-router'
import { useSessao } from '@/shared/sessao/sessao.hook'
import { paths } from '@/shared/lib/paths'

export function ProtectedRoute() {
  const { sessao } = useSessao()

  return sessao ? <Outlet /> : <Navigate to={paths.aluno.login} replace />
}

export function GuestRoute() {
  const { sessao } = useSessao()

  return sessao ? <Navigate to={paths.aluno.treino} replace /> : <Outlet />
}
