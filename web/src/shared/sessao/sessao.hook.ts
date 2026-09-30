import { createContext, useContext } from 'react'
import type { Sessao } from './sessao.dto'

export type SessaoContextoValor = {
  sessao: Sessao | null
  entrar: (sessao: Sessao) => void
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

export function useSessaoAluno() {
  const { sessao, sair } = useSessao()

  if (sessao?.papel !== 'aluno') {
    throw new Error('useSessaoAluno exige um aluno com sessao iniciada.')
  }

  return { sessao, sair }
}

export function useSessaoProfessor() {
  const { sessao, sair } = useSessao()

  if (sessao?.papel !== 'professor') {
    throw new Error('useSessaoProfessor exige um professor com sessao iniciada.')
  }

  return { sessao, sair }
}
