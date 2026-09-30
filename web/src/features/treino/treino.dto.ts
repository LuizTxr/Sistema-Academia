// Contrato da API: os nomes dos campos sao os que o backend devolve.
export type SerieResposta = {
  id: string
  label: string
  reps: string
}

export type ExercicioResposta = {
  id: string
  name: string
  notes?: string
  sets: SerieResposta[]
}

export type DiaTreinoResposta = {
  id: string
  label: string
  active: boolean
  title: string
  exercises: ExercicioResposta[]
}

// Modelo em portugues usado pela interface.
export type SerieTreino = {
  id: string
  rotulo: string
  repeticoes: string
}

export type ExercicioTreino = {
  id: string
  nome: string
  notas?: string
  series: SerieTreino[]
}

export type DiaTreino = {
  id: string
  rotulo: string
  ativo: boolean
  titulo: string
  exercicios: ExercicioTreino[]
}

export type ProgressoDia = {
  seriesConcluidas: string[]
  exerciciosConcluidos: string[]
}

export type ProgressoPorDia = Record<string, ProgressoDia>
