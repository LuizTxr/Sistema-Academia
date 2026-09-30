import { describe, expect, it } from 'vitest'
import type { Aluno } from './alunos.dto'
import { filtrarAlunosPorNome } from './alunos-lista.hook'

function aluno(id: number, nome: string): Aluno {
  return { id, nome, email: `${id}@email.com`, matricula: String(1000 + id), telefone: null }
}

const alunos = [aluno(1, 'Ana Beatriz Costa'), aluno(2, 'Elisa Ramos'), aluno(3, 'João Pedro')]

describe('filtrarAlunosPorNome', () => {
  it('devolve todos quando a busca esta vazia', () => {
    expect(filtrarAlunosPorNome(alunos, '   ')).toEqual(alunos)
  })

  it('ignora maiusculas, acentos e espacos nas pontas', () => {
    expect(filtrarAlunosPorNome(alunos, ' joao ')).toEqual([alunos[2]])
    expect(filtrarAlunosPorNome(alunos, 'ELISÁ')).toEqual([alunos[1]])
  })

  it('devolve lista vazia quando ninguem combina', () => {
    expect(filtrarAlunosPorNome(alunos, 'zzz')).toEqual([])
  })
})
