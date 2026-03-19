import { apiRequest } from '../../../services/api/client'
import type { StudentSession } from '../../../types/auth'

export function loginStudent(enrollmentCode: string) {
  return apiRequest<StudentSession>('/auth/aluno/login', {
    method: 'POST',
    body: JSON.stringify({ matricula: enrollmentCode }),
  })
}
