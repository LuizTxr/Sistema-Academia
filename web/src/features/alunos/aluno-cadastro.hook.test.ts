import { describe, expect, it } from 'vitest'
import type { Aluno } from './alunos.dto'
import { proximaMatricula, validarCamposAluno } from './aluno-cadastro.hook'

function alunoComMatricula(matricula: string): Aluno {
  return { id: 1, nome: 'Fulano', email: 'f@f.com', matricula, telefone: null }
}

describe('proximaMatricula', () => {
  it('comeca em 1 quando nao ha alunos', () => {
    expect(proximaMatricula([])).toBe('1')
  })

  it('soma 1 a maior matricula, comparando como numero', () => {
    expect(
      proximaMatricula([
        alunoComMatricula('99'),
        alunoComMatricula('100'),
        alunoComMatricula('2'),
      ]),
    ).toBe('101')
  })

  it('mantem os zeros a esquerda e ignora matriculas nao numericas', () => {
    expect(proximaMatricula([alunoComMatricula('0099'), alunoComMatricula('ABC')])).toBe('0100')
  })
})

describe('validarCamposAluno', () => {
  const valido = {
    nome: 'Maria Souza',
    email: 'maria@email.com',
    matricula: '1011',
    telefone: '',
  }

  it('aceita dados validos, com telefone opcional', () => {
    expect(validarCamposAluno(valido)).toEqual({})
  })

  it('exige nome, e-mail e matricula', () => {
    const erros = validarCamposAluno({ nome: '', email: '', matricula: '', telefone: '' })

    expect(Object.keys(erros).sort()).toEqual(['email', 'matricula', 'nome'])
  })

  it('rejeita e-mail invalido e matricula com letras', () => {
    expect(validarCamposAluno({ ...valido, email: 'maria@email' }).email).toBeDefined()
    expect(validarCamposAluno({ ...valido, matricula: '10a1' }).matricula).toBeDefined()
  })
})
