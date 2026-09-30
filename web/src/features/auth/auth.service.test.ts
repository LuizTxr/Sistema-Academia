import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErroApi } from '@/shared/lib/cliente-api'
import { entrarAluno, entrarProfessor } from './auth.service'

const fetchFalso = vi.fn()

function resposta(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status })
}

describe('auth.service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchFalso)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchFalso.mockReset()
  })

  describe('entrarAluno', () => {
    it('envia a matricula e converte a resposta da API para o modelo em portugues', async () => {
      fetchFalso.mockResolvedValue(
        resposta({
          enrollmentCode: '1001',
          studentName: 'Ana Beatriz',
          studentGoal: 'Hipertrofia',
        }),
      )

      const sessao = await entrarAluno('1001')

      expect(sessao).toEqual({
        papel: 'aluno',
        matricula: '1001',
        nome: 'Ana Beatriz',
        objetivo: 'Hipertrofia',
      })
      expect(fetchFalso.mock.calls[0][0]).toMatch(/\/auth\/aluno\/login$/)
      expect(fetchFalso.mock.calls[0][1]).toMatchObject({
        method: 'POST',
        body: JSON.stringify({ matricula: '1001' }),
      })
    })

    it('propaga o erro da API', async () => {
      fetchFalso.mockResolvedValue(resposta({ message: 'Aluno nao encontrado' }, 404))

      await expect(entrarAluno('9999')).rejects.toMatchObject({
        message: 'Aluno nao encontrado',
        status: 404,
      })
    })
  })

  describe('entrarProfessor', () => {
    it('envia e-mail e senha e devolve a sessao do professor', async () => {
      fetchFalso.mockResolvedValue(
        resposta({ id: 3, nome: 'Joao Silva', email: 'joao@academia.com' }),
      )

      const sessao = await entrarProfessor('joao@academia.com', 'segredo')

      expect(sessao).toEqual({
        papel: 'professor',
        id: 3,
        nome: 'Joao Silva',
        email: 'joao@academia.com',
      })
      expect(fetchFalso.mock.calls[0][0]).toMatch(/\/auth\/professor\/login$/)
      expect(fetchFalso.mock.calls[0][1]).toMatchObject({
        method: 'POST',
        body: JSON.stringify({ email: 'joao@academia.com', senha: 'segredo' }),
      })
    })

    it('rejeita com ErroApi 401 quando as credenciais estao erradas', async () => {
      fetchFalso.mockResolvedValue(
        resposta({ message: 'E-mail ou senha invalidos' }, 401),
      )

      const erro = await entrarProfessor('x@x.com', 'errada').catch((e) => e)

      expect(erro).toBeInstanceOf(ErroApi)
      expect(erro.status).toBe(401)
      expect(erro.message).toBe('E-mail ou senha invalidos')
    })
  })
})
