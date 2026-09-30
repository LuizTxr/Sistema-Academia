import { RouterProvider } from 'react-router'
import { router } from './router'

export function AppRouter() {
  return <RouterProvider router={router} />
}
