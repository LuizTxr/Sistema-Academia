import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroApi } from '@/shared/lib/cliente-api'
import { gravarSessao } from '@/shared/sessao/sessao.service'
import { criarTreino, listarTreinosDoAluno, removerTreino } from './gestao-treinos.service'

const fetchFalso = vi.fn()

describe('gestao-treinos.service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchFalso)
    fetchFalso.mockImplementation(async () => new Response('{}'))
    gravarSessao({ papel: 'professor', id: 3, nome: 'Joao', email: 'j@a.com' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchFalso.mockReset()
  })

  it('envia a identidade do professor e filtra os treinos pelo aluno', async () => {
    await listarTreinosDoAluno(17)

    const [url, init] = fetchFalso.mock.calls[0]

    expect(url).toMatch(/\/treinos\?alunoId=17$/)
    expect(init.headers).toMatchObject({ 'x-user-role': 'professor', 'x-user-id': '3' })
  })

  it('cria o treino com POST e o corpo completo', async () => {
    const dados = { nome: 'A', objetivo: 'X', diaSemana: 'qua', alunoId: 1, professorId: 3 }
    await criarTreino(dados)

    const [url, init] = fetchFalso.mock.calls[0]

    expect(url).toMatch(/\/treinos$/)
    expect(init).toMatchObject({ method: 'POST', body: JSON.stringify(dados) })
  })

  it('remove com DELETE e aceita a resposta vazia da API', async () => {
    fetchFalso.mockImplementation(async () => new Response(null, { status: 200 }))

    await expect(removerTreino(5)).resolves.toBeUndefined()
    expect(fetchFalso.mock.calls[0][1]).toMatchObject({ method: 'DELETE' })
  })

  it('propaga o erro da API como ErroApi', async () => {
    fetchFalso.mockImplementation(
      async () =>
        new Response(JSON.stringify({ message: 'Professor so pode remover treino proprio' }), {
          status: 403,
        }),
    )

    const erro = await removerTreino(1).catch((e) => e)

    expect(erro).toBeInstanceOf(ErroApi)
    expect(erro.status).toBe(403)
  })
})
