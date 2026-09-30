import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessao } from '@/shared/sessao/sessao.hook'
import { SessaoProvider } from '@/shared/sessao/sessao.provider'
import { gravarSessao, lerSessao } from '@/shared/sessao/sessao.service'
import type { DiaTreino, ExercicioTreino } from './treino.dto'
import {
  alternarSerie,
  escolherDiaSelecionado,
  podeAlternarSerie,
  useTreino,
} from './treino.hook'
import * as servico from './treino.service'

vi.mock('./treino.service', async (importarOriginal) => ({
  ...(await importarOriginal<typeof import('./treino.service')>()),
  buscarDiasTreino: vi.fn(),
}))

function exercicio(id: string, quantidadeDeSeries: number): ExercicioTreino {
  return {
    id,
    nome: `Exercicio ${id}`,
    series: Array.from({ length: quantidadeDeSeries }, (_, indice) => ({
      id: `${id}-s${indice + 1}`,
      rotulo: `Serie ${indice + 1}`,
      repeticoes: '10 reps',
    })),
  }
}

function dia(id: string, ativo: boolean, exercicios: ExercicioTreino[] = []): DiaTreino {
  return { id, rotulo: id, ativo, titulo: `Treino ${id}`, exercicios }
}

const vazio = { seriesConcluidas: [], exerciciosConcluidos: [] }

describe('regras puras do treino', () => {
  describe('escolherDiaSelecionado', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date('2026-09-30T12:00:00')) // quarta-feira
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const semana = [
      dia('seg', true),
      dia('ter', false),
      dia('qua', true),
      dia('qui', false),
      dia('sex', true),
    ]

    it('mantem o dia atual quando ele tem treino', () => {
      expect(escolherDiaSelecionado(semana, 'seg')).toBe('seg')
    })

    it('vai para hoje quando o dia atual esta desativado', () => {
      expect(escolherDiaSelecionado(semana, 'ter')).toBe('qua')
    })

    it('vai para o proximo dia com treino quando hoje nao tem', () => {
      const semHoje = [dia('seg', true), dia('qua', false), dia('sex', true)]

      expect(escolherDiaSelecionado(semHoje, 'qua')).toBe('sex')
    })

    it('volta ao primeiro dia com treino quando nao ha nenhum depois de hoje', () => {
      const soAntes = [dia('seg', true), dia('ter', true), dia('qua', false)]

      expect(escolherDiaSelecionado(soAntes, 'qua')).toBe('seg')
    })

    it('usa o primeiro dia quando nenhum tem treino', () => {
      expect(escolherDiaSelecionado([dia('seg', false), dia('ter', false)], 'qua')).toBe('seg')
    })

    it('devolve o dia atual quando a lista esta vazia', () => {
      expect(escolherDiaSelecionado([], 'qua')).toBe('qua')
    })
  })

  describe('podeAlternarSerie', () => {
    const supino = exercicio('e1', 3)

    it('so libera a primeira serie quando nada foi feito', () => {
      expect(podeAlternarSerie(supino, [], 'e1-s1')).toBe(true)
      expect(podeAlternarSerie(supino, [], 'e1-s2')).toBe(false)
      expect(podeAlternarSerie(supino, [], 'e1-s3')).toBe(false)
    })

    it('libera a proxima serie depois de concluir a anterior', () => {
      expect(podeAlternarSerie(supino, ['e1-s1'], 'e1-s2')).toBe(true)
      expect(podeAlternarSerie(supino, ['e1-s1'], 'e1-s3')).toBe(false)
    })

    it('so permite desmarcar a ultima serie concluida', () => {
      const feitas = ['e1-s1', 'e1-s2']

      expect(podeAlternarSerie(supino, feitas, 'e1-s2')).toBe(true)
      expect(podeAlternarSerie(supino, feitas, 'e1-s1')).toBe(false)
    })

    it('nao libera uma serie que nao existe', () => {
      expect(podeAlternarSerie(supino, [], 'outra')).toBe(false)
    })
  })

  describe('alternarSerie', () => {
    const supino = exercicio('e1', 2)

    it('ignora a acao fora de ordem', () => {
      const resultado = alternarSerie(vazio, supino, 'e1-s2')

      expect(resultado).toBe(vazio)
    })

    it('marca a serie em ordem sem concluir o exercicio', () => {
      expect(alternarSerie(vazio, supino, 'e1-s1')).toEqual({
        seriesConcluidas: ['e1-s1'],
        exerciciosConcluidos: [],
      })
    })

    it('conclui o exercicio ao marcar a ultima serie', () => {
      const parcial = { seriesConcluidas: ['e1-s1'], exerciciosConcluidos: [] }

      expect(alternarSerie(parcial, supino, 'e1-s2')).toEqual({
        seriesConcluidas: ['e1-s1', 'e1-s2'],
        exerciciosConcluidos: ['e1'],
      })
    })

    it('reabre o exercicio ao desmarcar a ultima serie', () => {
      const completo = {
        seriesConcluidas: ['e1-s1', 'e1-s2'],
        exerciciosConcluidos: ['e1'],
      }

      expect(alternarSerie(completo, supino, 'e1-s2')).toEqual({
        seriesConcluidas: ['e1-s1'],
        exerciciosConcluidos: [],
      })
    })
  })
})

describe('useTreino', () => {
  const matricula = '1001'
  const supino = exercicio('e1', 2)
  const remada = exercicio('e2', 1)
  const semana = [
    dia('seg', false),
    dia('qua', true, [supino, remada]),
    dia('sex', true, [exercicio('e3', 1)]),
  ]

  // Faz o papel do ProtectedRoute: sem sessao, a pagina deixa de ser renderizada.
  function ApenasComSessao({ children }: PropsWithChildren) {
    const { sessao } = useSessao()

    return sessao ? children : null
  }

  function envolver({ children }: PropsWithChildren) {
    return (
      <SessaoProvider>
        <ApenasComSessao>{children}</ApenasComSessao>
      </SessaoProvider>
    )
  }

  async function renderizar() {
    const resultado = renderHook(() => useTreino(), { wrapper: envolver })
    await waitFor(() => expect(resultado.result.current.carregando).toBe(false))

    return resultado
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-09-30T12:00:00')) // quarta-feira
    gravarSessao({ papel: 'aluno', matricula, nome: 'Ana', objetivo: 'Hipertrofia' })
    vi.mocked(servico.buscarDiasTreino).mockResolvedValue(semana)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.mocked(servico.buscarDiasTreino).mockReset()
  })

  it('carrega os dias, seleciona hoje e expoe os dados do aluno', async () => {
    const { result } = await renderizar()

    expect(servico.buscarDiasTreino).toHaveBeenCalledWith(matricula)
    expect(result.current.aluno).toEqual({ nome: 'Ana', objetivo: 'Hipertrofia' })
    expect(result.current.diaSelecionadoId).toBe('qua')
    expect(result.current.exercicios.map((item) => item.exercicio.id)).toEqual(['e1', 'e2'])
    expect(result.current.treinoConcluido).toBe(false)
    expect(result.current.temAlteracoesPendentes).toBe(false)
  })

  it('respeita a ordem das series e marca alteracoes pendentes', async () => {
    const { result } = await renderizar()

    act(() => result.current.alternarSerie('e1', 'e1-s2'))
    expect(result.current.temAlteracoesPendentes).toBe(false)

    act(() => result.current.alternarSerie('e1', 'e1-s1'))
    expect(result.current.exercicios[0].seriesConcluidas).toEqual(['e1-s1'])
    expect(result.current.temAlteracoesPendentes).toBe(true)
  })

  it('conclui o treino quando todos os exercicios do dia terminam', async () => {
    const { result } = await renderizar()

    act(() => result.current.concluirExercicio('e1'))
    expect(result.current.treinoConcluido).toBe(false)

    act(() => result.current.concluirExercicio('e2'))
    expect(result.current.treinoConcluido).toBe(true)
  })

  it('salva o progresso e limpa as alteracoes pendentes', async () => {
    const { result } = await renderizar()

    act(() => result.current.concluirExercicio('e2'))
    act(() => result.current.salvarProgresso())

    expect(result.current.temAlteracoesPendentes).toBe(false)
    expect(result.current.salvoEm).not.toBeNull()
    expect(servico.lerProgressoSalvo(matricula)).toEqual({
      qua: { seriesConcluidas: ['e2-s1'], exerciciosConcluidos: ['e2'] },
    })
  })

  it('guarda o rascunho no aparelho e o restaura ao voltar', async () => {
    const primeira = await renderizar()
    act(() => primeira.result.current.alternarSerie('e1', 'e1-s1'))
    primeira.unmount()

    expect(servico.lerRascunho(matricula)).toEqual({
      qua: { seriesConcluidas: ['e1-s1'], exerciciosConcluidos: [] },
    })

    const segunda = await renderizar()

    expect(segunda.result.current.exercicios[0].seriesConcluidas).toEqual(['e1-s1'])
    expect(segunda.result.current.temAlteracoesPendentes).toBe(true)
  })

  it('sair apaga o progresso local e encerra a sessao', async () => {
    const { result } = await renderizar()

    act(() => result.current.concluirExercicio('e2'))
    act(() => result.current.salvarProgresso())
    act(() => result.current.sair())

    expect(servico.lerRascunho(matricula)).toBeNull()
    expect(servico.lerProgressoSalvo(matricula)).toBeNull()
    expect(lerSessao()).toBeNull()
  })
})
