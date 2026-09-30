import { requisicaoApi } from '@/shared/lib/cliente-api'
import type { Aluno, NovoAluno } from './alunos.dto'

export function listarAlunos() {
  return requisicaoApi<Aluno[]>('/alunos', { comoProfessor: true })
}

export function cadastrarAluno(dados: NovoAluno) {
  return requisicaoApi<Aluno>('/alunos', {
    method: 'POST',
    body: JSON.stringify(dados),
    comoProfessor: true,
  })
}
