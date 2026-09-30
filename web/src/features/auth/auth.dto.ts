// Contrato da API: os nomes dos campos sao os que o backend devolve.
export type SessaoAlunoResposta = {
  enrollmentCode: string
  studentName: string
  studentGoal: string
}

export type SessaoProfessorResposta = {
  id: number
  nome: string
  email: string
}
