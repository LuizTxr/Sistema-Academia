import { buscarTreinos } from '../../../services/api/client'
import type { WorkoutDraftByDay } from '../types/workout'

export function fetchWorkoutDays(alunoId: number): Promise<{
  dias: import('../types/workout').WorkoutDay[]
  progressoInicial: WorkoutDraftByDay
}> {
  return buscarTreinos(alunoId)
}
