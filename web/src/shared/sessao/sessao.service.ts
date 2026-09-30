import { gravarJson, lerJson, removerItem } from '@/shared/lib/armazenamento'
import type { SessaoAluno } from './sessao.dto'

const chaveSessao = 'sessao-aluno'

export function lerSessao() {
  return lerJson<SessaoAluno>(chaveSessao)
}

export function gravarSessao(sessao: SessaoAluno) {
  gravarJson(chaveSessao, sessao)
}

export function removerSessao() {
  removerItem(chaveSessao)
}
