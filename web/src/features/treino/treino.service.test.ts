import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buscarDiasTreino,
  gravarRascunho,
  lerRascunho,
  removerProgresso,
} from './treino.service'

const fetchFalso = vi.fn()

describe('treino.service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchFalso)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchFalso.mockReset()
  })

  it('converte os dias da API (ingles) para o modelo em portugues', async () => {
    fetchFalso.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'seg',
            label: 'Seg',
            active: true,
            title: 'Treino A',
            exercises: [
              {
                id: '1-10',
                name: 'Supino reto',
                notes: 'Controle a descida',
                sets: [{ id: '1-10-serie-1', label: 'Serie 1', reps: '12 reps' }],
              },
            ],
          },
        ]),
      ),
    )

    const dias = await buscarDiasTreino('1001')

    expect(fetchFalso.mock.calls[0][0]).toMatch(/\/alunos\/1001\/treinos$/)
    expect(dias).toEqual([
      {
        id: 'seg',
        rotulo: 'Seg',
        ativo: true,
        titulo: 'Treino A',
        exercicios: [
          {
            id: '1-10',
            nome: 'Supino reto',
            notas: 'Controle a descida',
            series: [{ id: '1-10-serie-1', rotulo: 'Serie 1', repeticoes: '12 reps' }],
          },
        ],
      },
    ])
  })

  it('guarda o progresso por matricula e remove so o do aluno que saiu', () => {
    const progresso = { seg: { seriesConcluidas: ['s1'], exerciciosConcluidos: [] } }
    gravarRascunho('1001', progresso)
    gravarRascunho('1002', progresso)

    removerProgresso('1001')

    expect(lerRascunho('1001')).toBeNull()
    expect(lerRascunho('1002')).toEqual(progresso)
  })
})
