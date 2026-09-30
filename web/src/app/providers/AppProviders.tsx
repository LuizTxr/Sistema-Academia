import type { PropsWithChildren } from 'react'
import { SessaoProvider } from '@/shared/sessao/sessao.provider'

export function AppProviders({ children }: PropsWithChildren) {
  return <SessaoProvider>{children}</SessaoProvider>
}
