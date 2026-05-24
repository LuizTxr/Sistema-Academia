import { apiRequest } from '../../../services/api/client'
import type { StudentSession } from '../../../types/auth'

export async function loginStudent(enrollmentCode: string): Promise<StudentSession> {
  const { aluno } = await apiRequest<{ aluno: { id: number; matricula: string; nome: string } }>(
    '/api/auth/aluno/login',
    {
      method: 'POST',
      body: JSON.stringify({ matricula: enrollmentCode }),
    },
  )

  return {
    id: aluno.id,
    enrollmentCode: aluno.matricula,
    studentName: aluno.nome,
  }
}
