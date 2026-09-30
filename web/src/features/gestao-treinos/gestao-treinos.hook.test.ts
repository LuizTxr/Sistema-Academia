import { describe, expect, it } from 'vitest'
import type { ItemTreino, TreinoAluno } from './gestao-treinos.dto'
import {
  camposDoItem,
  camposItemVazio,
  montarDadosItem,
  proximaOrdem,
  validarCamposItem,
} from './gestao-treinos.hook'

function item(id: number, ordem: number | null, extras: Partial<ItemTreino> = {}): ItemTreino {
  return {
    id,
    treinoId: 1,
    exercicioId: 1,
    series: 3,
    repeticoes: 12,
    carga: null,
    descanso: null,
    observacao: null,
    ordem,
    exercicio: { id: 1, nome: 'Supino reto', grupoMuscular: 'Peito', equipamentoId: 1 },
    ...extras,
  }
}

function treino(exercicios: ItemTreino[]): TreinoAluno {
  return { id: 1, nome: 'A', diaSemana: 'seg', professorId: 3, alunoId: 1, objetivo: 'X', exercicios }
}

describe('proximaOrdem', () => {
  it('comeca em 1 num treino vazio e soma 1 a maior ordem existente', () => {
    expect(proximaOrdem(treino([]))).toBe(1)
    expect(proximaOrdem(treino([item(1, 1), item(2, 3), item(3, 2)]))).toBe(4)
  })
})

describe('validarCamposItem', () => {
  const valido = { ...camposItemVazio, exercicioId: '5' }

  it('aceita o formulario padrao com um exercicio escolhido', () => {
    expect(validarCamposItem(valido)).toEqual({})
  })

  it('exige exercicio e series/repeticoes inteiras maiores que zero', () => {
    expect(validarCamposItem(camposItemVazio).exercicioId).toBeDefined()
    expect(validarCamposItem({ ...valido, series: '0' }).series).toBeDefined()
    expect(validarCamposItem({ ...valido, repeticoes: '2.5' }).repeticoes).toBeDefined()
  })

  it('aceita carga com virgula e rejeita texto', () => {
    expect(validarCamposItem({ ...valido, carga: '22,5' }).carga).toBeUndefined()
    expect(validarCamposItem({ ...valido, carga: 'pesado' }).carga).toBeDefined()
  })
})

describe('montarDadosItem', () => {
  it('converte os campos de texto para numeros', () => {
    expect(
      montarDadosItem({
        exercicioId: '5',
        series: '4',
        repeticoes: '10',
        carga: '22,5',
        descanso: '60',
        observacao: '  Controle a descida  ',
      }),
    ).toEqual({
      exercicioId: 5,
      series: 4,
      repeticoes: 10,
      carga: 22.5,
      descanso: 60,
      observacao: 'Controle a descida',
    })
  })

  it('envia null para carga e descanso vazios, para limpar no backend', () => {
    const dados = montarDadosItem({ ...camposItemVazio, exercicioId: '5' })

    expect(dados.carga).toBeNull()
    expect(dados.descanso).toBeNull()
  })

  it('ida e volta: item -> campos -> dados preserva os valores', () => {
    const original = item(9, 1, { exercicioId: 7, series: 5, repeticoes: 8, carga: 30, descanso: 45, observacao: 'X' })

    expect(montarDadosItem(camposDoItem(original))).toMatchObject({
      exercicioId: 7,
      series: 5,
      repeticoes: 8,
      carga: 30,
      descanso: 45,
      observacao: 'X',
    })
  })
})
