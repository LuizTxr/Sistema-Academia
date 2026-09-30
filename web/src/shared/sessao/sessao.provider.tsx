import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Sessao } from './sessao.dto'
import { SessaoContexto } from './sessao.hook'
import type { SessaoContextoValor } from './sessao.hook'
import { gravarSessao, lerSessao, removerSessao } from './sessao.service'

export function SessaoProvider({ children }: PropsWithChildren) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)

  const valor = useMemo<SessaoContextoValor>(
    () => ({
      sessao,
      entrar(novaSessao) {
        gravarSessao(novaSessao)
        setSessao(novaSessao)
      },
      sair() {
        removerSessao()
        setSessao(null)
      },
    }),
    [sessao],
  )

  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>
}
