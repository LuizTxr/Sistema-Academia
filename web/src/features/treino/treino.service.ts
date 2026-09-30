import { gravarJson, lerJson, removerItem } from '@/shared/lib/armazenamento'
import { requisicaoApi } from '@/shared/lib/cliente-api'
import type {
  DiaTreino,
  DiaTreinoResposta,
  ProgressoPorDia,
} from './treino.dto'

const prefixoRascunho = 'rascunho-treino'
const prefixoProgressoSalvo = 'progresso-salvo-treino'

function montarChave(prefixo: string, matricula: string) {
  return `${prefixo}:${matricula}`
}

function converterDia(dia: DiaTreinoResposta): DiaTreino {
  return {
    id: dia.id,
    rotulo: dia.label,
    ativo: dia.active,
    titulo: dia.title,
    exercicios: dia.exercises.map((exercicio) => ({
      id: exercicio.id,
      nome: exercicio.name,
      notas: exercicio.notes,
      series: exercicio.sets.map((serie) => ({
        id: serie.id,
        rotulo: serie.label,
        repeticoes: serie.reps,
      })),
    })),
  }
}

export async function buscarDiasTreino(matricula: string) {
  const dias = await requisicaoApi<DiaTreinoResposta[]>(
    `/alunos/${matricula}/treinos`,
  )

  return dias.map(converterDia)
}

export function lerRascunho(matricula: string) {
  return lerJson<ProgressoPorDia>(montarChave(prefixoRascunho, matricula))
}

export function gravarRascunho(matricula: string, progresso: ProgressoPorDia) {
  gravarJson(montarChave(prefixoRascunho, matricula), progresso)
}

export function lerProgressoSalvo(matricula: string) {
  return lerJson<ProgressoPorDia>(
    montarChave(prefixoProgressoSalvo, matricula),
  )
}

export function gravarProgressoSalvo(
  matricula: string,
  progresso: ProgressoPorDia,
) {
  gravarJson(montarChave(prefixoProgressoSalvo, matricula), progresso)
}

export function removerProgresso(matricula: string) {
  removerItem(montarChave(prefixoRascunho, matricula))
  removerItem(montarChave(prefixoProgressoSalvo, matricula))
}
