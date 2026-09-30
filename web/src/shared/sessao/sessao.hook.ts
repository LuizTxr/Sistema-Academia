import { createContext, useContext } from 'react'
import type { SessaoAluno } from './sessao.dto'

export type SessaoContextoValor = {
  sessao: SessaoAluno | null
  entrar: (sessao: SessaoAluno) => void
  sair: () => void
}

export const SessaoContexto = createContext<SessaoContextoValor | null>(null)

export function useSessao() {
  const contexto = useContext(SessaoContexto)

  if (!contexto) {
    throw new Error('useSessao deve ser usado dentro de SessaoProvider.')
  }

  return contexto
}

export function useSessaoAtiva() {
  const { sessao, sair } = useSessao()

  if (!sessao) {
    throw new Error('useSessaoAtiva exige um aluno com sessao iniciada.')
  }

  return { sessao, sair }
}
