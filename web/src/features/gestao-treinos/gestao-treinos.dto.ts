// Contrato da API: os campos ja vem em portugues, entao o modelo e o proprio DTO.
export type AlunoResumo = {
  id: number
  nome: string
  matricula: string
}

export type ExercicioCatalogo = {
  id: number
  nome: string
  grupoMuscular: string
  equipamentoId: number
}

export type ItemTreino = {
  id: number
  treinoId: number
  exercicioId: number
  series: number
  repeticoes: number
  carga: number | null
  descanso: number | null
  observacao: string | null
  ordem: number | null
  exercicio: ExercicioCatalogo
}

export type TreinoAluno = {
  id: number
  nome: string
  diaSemana: string
  professorId: number
  alunoId: number
  objetivo: string
  exercicios: ItemTreino[]
}

export type DadosTreino = {
  nome: string
  objetivo: string
}

export type NovoTreino = DadosTreino & {
  diaSemana: string
  alunoId: number
  professorId: number
}

export type DadosItem = {
  exercicioId: number
  series: number
  repeticoes: number
  carga?: number | null
  descanso?: number | null
  observacao?: string
}

export type NovoItem = DadosItem & {
  treinoId: number
  ordem: number
}
