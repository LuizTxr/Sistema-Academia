import { requisicaoApi } from '@/shared/lib/cliente-api'
import type {
  AlunoResumo,
  DadosItem,
  DadosTreino,
  ExercicioCatalogo,
  NovoItem,
  NovoTreino,
  TreinoAluno,
} from './gestao-treinos.dto'

const comoProfessor = { comoProfessor: true }

function enviar(metodo: string, corpo: unknown) {
  return { method: metodo, body: JSON.stringify(corpo), ...comoProfessor }
}

export function buscarAluno(alunoId: number) {
  return requisicaoApi<AlunoResumo>(`/alunos/${alunoId}`, comoProfessor)
}

export function listarExercicios() {
  return requisicaoApi<ExercicioCatalogo[]>('/exercicios', comoProfessor)
}

export function listarTreinosDoAluno(alunoId: number) {
  return requisicaoApi<TreinoAluno[]>(
    `/treinos?alunoId=${alunoId}`,
    comoProfessor,
  )
}

export function criarTreino(dados: NovoTreino) {
  return requisicaoApi<TreinoAluno>('/treinos', enviar('POST', dados))
}

export function atualizarTreino(treinoId: number, dados: DadosTreino) {
  return requisicaoApi<TreinoAluno>(
    `/treinos/${treinoId}`,
    enviar('PUT', dados),
  )
}

export function removerTreino(treinoId: number) {
  return requisicaoApi<void>(`/treinos/${treinoId}`, {
    method: 'DELETE',
    ...comoProfessor,
  })
}

export function adicionarItem(dados: NovoItem) {
  return requisicaoApi<unknown>('/treino-exercicios', enviar('POST', dados))
}

export function atualizarItem(itemId: number, dados: DadosItem) {
  return requisicaoApi<unknown>(
    `/treino-exercicios/${itemId}`,
    enviar('PATCH', dados),
  )
}

export function removerItem(itemId: number) {
  return requisicaoApi<void>(`/treino-exercicios/${itemId}`, {
    method: 'DELETE',
    ...comoProfessor,
  })
}
