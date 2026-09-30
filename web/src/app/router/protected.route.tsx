import { Navigate, Outlet } from 'react-router'
import { paths } from '@/shared/lib/paths'
import type { PapelSessao } from '@/shared/sessao/sessao.dto'
import { useSessao } from '@/shared/sessao/sessao.hook'

const inicioPorPapel: Record<PapelSessao, string> = {
  aluno: paths.aluno.treino,
  professor: paths.professor.alunos,
}

const loginPorPapel: Record<PapelSessao, string> = {
  aluno: paths.aluno.login,
  professor: paths.professor.login,
}

type ProtectedRouteProps = {
  papel: PapelSessao
}

export function ProtectedRoute({ papel }: ProtectedRouteProps) {
  const { sessao } = useSessao()

  if (!sessao) {
    return <Navigate to={loginPorPapel[papel]} replace />
  }

  if (sessao.papel !== papel) {
    return <Navigate to={inicioPorPapel[sessao.papel]} replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { sessao } = useSessao()

  return sessao ? (
    <Navigate to={inicioPorPapel[sessao.papel]} replace />
  ) : (
    <Outlet />
  )
}
