import { createBrowserRouter, Navigate } from 'react-router'
import { paths } from '@/shared/lib/paths'
import { GuestRoute, ProtectedRoute } from './protected.route'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={paths.aluno.treino} replace /> },
  {
    element: <GuestRoute />,
    children: [
      {
        path: paths.aluno.login,
        lazy: async () => ({
          Component: (await import('@/features/auth/login-aluno.page'))
            .LoginAlunoPage,
        }),
      },
      {
        path: paths.professor.login,
        lazy: async () => ({
          Component: (await import('@/features/auth/login-professor.page'))
            .LoginProfessorPage,
        }),
      },
    ],
  },
  {
    element: <ProtectedRoute papel="aluno" />,
    children: [
      {
        path: paths.aluno.treino,
        lazy: async () => ({
          Component: (await import('@/features/treino/treino.page')).TreinoPage,
        }),
      },
    ],
  },
  {
    element: <ProtectedRoute papel="professor" />,
    children: [
      {
        path: paths.professor.alunos,
        lazy: async () => ({
          Component: (await import('@/features/alunos/alunos-lista.page'))
            .AlunosListaPage,
        }),
      },
      {
        path: paths.professor.novoAluno,
        lazy: async () => ({
          Component: (await import('@/features/alunos/aluno-cadastro.page'))
            .AlunoCadastroPage,
        }),
      },
      {
        path: paths.professor.treinosDoAluno,
        lazy: async () => ({
          Component: (await import('@/features/gestao-treinos/gestao-treinos.page'))
            .GestaoTreinosPage,
        }),
      },
    ],
  },
  { path: '*', element: <Navigate to={paths.aluno.treino} replace /> },
])
