import { describe, expect, it } from 'vitest'
import { gravarSessao, lerSessao } from './sessao.service'

describe('sessao.service', () => {
  it('grava e le a sessao', () => {
    const sessao = { papel: 'professor', id: 3, nome: 'Joao', email: 'j@a.com' } as const
    gravarSessao(sessao)

    expect(lerSessao()).toEqual(sessao)
  })

  it('descarta sessao gravada sem papel (formato antigo)', () => {
    window.localStorage.setItem('sessao', JSON.stringify({ matricula: '1001', nome: 'Ana' }))

    expect(lerSessao()).toBeNull()
    expect(window.localStorage.getItem('sessao')).toBeNull()
  })
})
