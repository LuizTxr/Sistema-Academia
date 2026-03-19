import { apiRequest } from '../../../services/api/client'
import type { WorkoutDay } from '../types/workout'

export function fetchWorkoutDays(enrollmentCode: string) {
  return apiRequest<WorkoutDay[]>(`/alunos/${enrollmentCode}/treinos`)
}
