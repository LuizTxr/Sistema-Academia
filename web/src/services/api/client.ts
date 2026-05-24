import type { WorkoutDay, WorkoutDraftByDay } from '../../features/workout/types/workout'

const baseUrl = import.meta.env.VITE_BACKEND_URL

const labelPorDia: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua',
  qui: 'Qui', sex: 'Sex', sab: 'Sab', dom: 'Dom',
}

const ordemDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

export const apiClient = {
  async loginAluno(matricula: string) {
    const response = await fetch(`${baseUrl}/api/auth/aluno/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula }),
    })

    if (!response.ok) {
      throw new Error('Matricula nao encontrada.')
    }

    return response.json() as Promise<{
      aluno: { id: number; matricula: string; nome: string }
    }>
  },

  async buscarTreinos(alunoId: number): Promise<{ dias: WorkoutDay[]; progressoInicial: WorkoutDraftByDay }> {
    const response = await fetch(`${baseUrl}/alunos/${alunoId}/treinos`)

    if (!response.ok) {
      throw new Error('Erro ao buscar treinos.')
    }

    const treinos: any[] = await response.json()

    const progressoInicial: WorkoutDraftByDay = {}

    const dias: WorkoutDay[] = treinos
      .sort((a, b) => ordemDias.indexOf(a.diaSemana) - ordemDias.indexOf(b.diaSemana))
      .map((treino) => {
        if (treino.progresso) {
          progressoInicial[treino.diaSemana] = {
            completedSetIds: treino.progresso.seriesConcluidas,
            completedExerciseIds: treino.progresso.exerciciosConcluidos,
          }
        }

        return {
          id: treino.diaSemana,
          label: labelPorDia[treino.diaSemana] ?? treino.diaSemana,
          active: treino.ativo,
          title: treino.nome,
          exercises: treino.exercicios.map((te: any) => ({
            id: String(te.exercicioId),
            name: te.exercicio.nome,
            notes: te.observacao ?? undefined,
            sets: Array.from({ length: te.series }, (_, i) => ({
              id: `ex-${te.exercicioId}-serie-${i + 1}`,
              label: `Serie ${i + 1}`,
              reps: `${te.repeticoes} reps`,
            })),
          })),
        }
      })

    return { dias, progressoInicial }
  },

  async salvarProgresso(
    alunoId: number,
    diaSemana: string,
    seriesConcluidas: string[],
    exerciciosConcluidos: string[],
  ) {
    const response = await fetch(`${baseUrl}/alunos/${alunoId}/treinos/${diaSemana}/progresso`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesConcluidas, exerciciosConcluidos }),
    })

    if (!response.ok) {
      throw new Error('Erro ao salvar progresso.')
    }

    return response.json()
  },
}
