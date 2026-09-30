import { apiRequest } from '../../services/api/client'
import type { StudentSession } from './auth.dto'

export function loginStudent(enrollmentCode: string) {
  return apiRequest<StudentSession>('/auth/aluno/login', {
    method: 'POST',
    body: JSON.stringify({ matricula: enrollmentCode }),
  })
}
