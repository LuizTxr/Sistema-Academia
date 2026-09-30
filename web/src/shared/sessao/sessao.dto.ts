export type PapelSessao = 'aluno' | 'professor'

export type SessaoAluno = {
  papel: 'aluno'
  matricula: string
  nome: string
  objetivo: string
}

export type SessaoProfessor = {
  papel: 'professor'
  id: number
  nome: string
  email: string
}

export type Sessao = SessaoAluno | SessaoProfessor
