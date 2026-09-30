import { createBrowserRouter, Navigate } from 'react-router'
import { GuestRoute, ProtectedRoute } from './protected.route'
import { paths } from './paths'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={paths.aluno.treino} replace /> },
  {
    element: <GuestRoute />,
    children: [
      {
        path: paths.aluno.login,
        lazy: async () => ({
          Component: (await import('@/features/auth/login.page')).LoginPage,
        }),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.aluno.treino,
        lazy: async () => ({
          Component: (await import('@/features/treino/treino.page')).TreinoPage,
        }),
      },
    ],
  },
  { path: '*', element: <Navigate to={paths.aluno.treino} replace /> },
])
