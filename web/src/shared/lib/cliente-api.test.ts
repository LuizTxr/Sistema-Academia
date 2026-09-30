import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { gravarSessao } from '@/shared/sessao/sessao.service'
import { clienteApi, ErroApi, requisicaoApi } from './cliente-api'

async function capturarErro(chamada: Promise<unknown>) {
  try {
    await chamada
  } catch (erro) {
    return erro as ErroApi
  }

  throw new Error('A chamada deveria ter falhado.')
}

function resposta(corpo: unknown, status = 200) {
  return new Response(corpo === undefined ? null : JSON.stringify(corpo), {
    status,
  })
}

describe('requisicaoApi', () => {
  const fetchFalso = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchFalso)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchFalso.mockReset()
  })

  it('chama a URL base com o caminho e devolve o JSON', async () => {
    fetchFalso.mockResolvedValue(resposta({ ok: true }))

    await expect(requisicaoApi('/alunos')).resolves.toEqual({ ok: true })

    expect(fetchFalso).toHaveBeenCalledWith(
      `${clienteApi.urlBase}/alunos`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('devolve undefined quando o corpo vem vazio', async () => {
    fetchFalso.mockResolvedValue(resposta(undefined))

    await expect(requisicaoApi('/treinos/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('repassa metodo e corpo', async () => {
    fetchFalso.mockResolvedValue(resposta({}))

    await requisicaoApi('/alunos', { method: 'POST', body: '{"a":1}' })

    expect(fetchFalso.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: '{"a":1}',
    })
  })

  it('nao envia headers de identidade por padrao', async () => {
    fetchFalso.mockResolvedValue(resposta({}))

    await requisicaoApi('/alunos')

    expect(fetchFalso.mock.calls[0][1].headers).not.toHaveProperty('x-user-role')
  })

  describe('erros', () => {
    it('usa a mensagem em texto devolvida pelo backend', async () => {
      fetchFalso.mockResolvedValue(resposta({ message: 'Matricula ja cadastrada' }, 409))

      const erro = await capturarErro(requisicaoApi('/alunos'))

      expect(erro).toBeInstanceOf(ErroApi)
      expect(erro.message).toBe('Matricula ja cadastrada')
      expect(erro.status).toBe(409)
    })

    it('junta mensagens de validacao quando vem uma lista', async () => {
      fetchFalso.mockResolvedValue(
        resposta({ message: ['email must be an email', 'senha should not be empty'] }, 400),
      )

      const erro = await capturarErro(requisicaoApi('/x'))

      expect(erro.message).toBe('email must be an email, senha should not be empty')
    })

    it('usa a mensagem padrao quando a resposta nao e JSON', async () => {
      fetchFalso.mockResolvedValue(new Response('<html>erro</html>', { status: 500 }))

      const erro = await capturarErro(requisicaoApi('/x'))

      expect(erro.message).toBe('Nao foi possivel concluir a requisicao.')
      expect(erro.status).toBe(500)
    })
  })

  describe('comoProfessor', () => {
    it('envia os headers de identidade do professor logado', async () => {
      gravarSessao({ papel: 'professor', id: 3, nome: 'Joao', email: 'j@a.com' })
      fetchFalso.mockResolvedValue(resposta({}))

      await requisicaoApi('/treinos', { comoProfessor: true })

      expect(fetchFalso.mock.calls[0][1].headers).toMatchObject({
        'x-user-role': 'professor',
        'x-user-id': '3',
      })
    })

    it('nao envia a opcao comoProfessor ao fetch', async () => {
      gravarSessao({ papel: 'professor', id: 3, nome: 'Joao', email: 'j@a.com' })
      fetchFalso.mockResolvedValue(resposta({}))

      await requisicaoApi('/treinos', { comoProfessor: true })

      expect(fetchFalso.mock.calls[0][1]).not.toHaveProperty('comoProfessor')
    })

    it('falha com 401, sem chamar a API, quando nao ha sessao', async () => {
      const erro = await capturarErro(requisicaoApi('/treinos', { comoProfessor: true }))

      expect(erro).toBeInstanceOf(ErroApi)
      expect(erro.status).toBe(401)
      expect(fetchFalso).not.toHaveBeenCalled()
    })

    it('falha com 401 quando a sessao e de aluno', async () => {
      gravarSessao({ papel: 'aluno', matricula: '1001', nome: 'Ana', objetivo: 'X' })

      const erro = await capturarErro(requisicaoApi('/treinos', { comoProfessor: true }))

      expect(erro.status).toBe(401)
      expect(fetchFalso).not.toHaveBeenCalled()
    })
  })
})
