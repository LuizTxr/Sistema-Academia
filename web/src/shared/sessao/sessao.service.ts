import { gravarJson, lerJson, removerItem } from '@/shared/lib/armazenamento'
import type { Sessao } from './sessao.dto'

const chaveSessao = 'sessao'

export function lerSessao() {
  const sessao = lerJson<Sessao>(chaveSessao)

  if (sessao?.papel !== 'aluno' && sessao?.papel !== 'professor') {
    removerItem(chaveSessao)
    return null
  }

  return sessao
}

export function gravarSessao(sessao: Sessao) {
  gravarJson(chaveSessao, sessao)
}

export function removerSessao() {
  removerItem(chaveSessao)
}
