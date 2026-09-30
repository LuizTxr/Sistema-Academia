import { requisicaoApi } from '@/shared/lib/cliente-api'
import type { SessaoAluno, SessaoProfessor } from '@/shared/sessao/sessao.dto'
import type { SessaoAlunoResposta, SessaoProfessorResposta } from './auth.dto'

export async function entrarAluno(matricula: string): Promise<SessaoAluno> {
  const resposta = await requisicaoApi<SessaoAlunoResposta>(
    '/auth/aluno/login',
    {
      method: 'POST',
      body: JSON.stringify({ matricula }),
    },
  )

  return {
    papel: 'aluno',
    matricula: resposta.enrollmentCode,
    nome: resposta.studentName,
    objetivo: resposta.studentGoal,
  }
}

export async function entrarProfessor(
  email: string,
  senha: string,
): Promise<SessaoProfessor> {
  const resposta = await requisicaoApi<SessaoProfessorResposta>(
    '/auth/professor/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    },
  )

  return {
    papel: 'professor',
    id: resposta.id,
    nome: resposta.nome,
    email: resposta.email,
  }
}
