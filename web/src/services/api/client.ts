import type { WorkoutDay, WorkoutDraftByDay } from '../../features/workout/types/workout'

export const apiClient = {
  baseUrl: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiClient.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Nao foi possivel concluir a requisicao.'

    try {
      const payload = (await response.json()) as { message?: string | string[] }
      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ')
      } else if (payload.message) {
        message = payload.message
      }
    } catch {
      // Mantem a mensagem padrao quando o backend nao devolve JSON.
    }

    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

const labelPorDia: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua',
  qui: 'Qui', sex: 'Sex', sab: 'Sab', dom: 'Dom',
}

const ordemDias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

export async function buscarTreinos(
  alunoId: number,
): Promise<{ dias: WorkoutDay[]; progressoInicial: WorkoutDraftByDay }> {
  const treinos = await apiRequest<any[]>(`/alunos/${alunoId}/treinos`)

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
}

export function salvarProgresso(
  alunoId: number,
  diaSemana: string,
  seriesConcluidas: string[],
  exerciciosConcluidos: string[],
) {
  return apiRequest(`/alunos/${alunoId}/treinos/${diaSemana}/progresso`, {
    method: 'PUT',
    body: JSON.stringify({ seriesConcluidas, exerciciosConcluidos }),
  })
}
