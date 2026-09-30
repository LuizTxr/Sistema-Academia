import { requisicaoApi } from '@/shared/lib/cliente-api'
import type { SessaoAluno } from '@/shared/sessao/sessao.dto'
import type { SessaoAlunoResposta } from './auth.dto'

export async function entrarAluno(matricula: string): Promise<SessaoAluno> {
  const resposta = await requisicaoApi<SessaoAlunoResposta>(
    '/auth/aluno/login',
    {
      method: 'POST',
      body: JSON.stringify({ matricula }),
    },
  )

  return {
    matricula: resposta.enrollmentCode,
    nome: resposta.studentName,
    objetivo: resposta.studentGoal,
  }
}
