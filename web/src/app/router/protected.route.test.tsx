import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { Sessao } from '@/shared/sessao/sessao.dto'
import { SessaoProvider } from '@/shared/sessao/sessao.provider'
import { gravarSessao } from '@/shared/sessao/sessao.service'
import { GuestRoute, ProtectedRoute } from './protected.route'

const aluno: Sessao = { papel: 'aluno', matricula: '1001', nome: 'Ana', objetivo: 'X' }
const professor: Sessao = { papel: 'professor', id: 3, nome: 'Joao', email: 'j@a.com' }

function renderizarEm(caminho: string, sessao?: Sessao) {
  if (sessao) {
    gravarSessao(sessao)
  }

  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <SessaoProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/aluno/login" element={<p>tela login aluno</p>} />
            <Route path="/professor/login" element={<p>tela login professor</p>} />
          </Route>
          <Route element={<ProtectedRoute papel="aluno" />}>
            <Route path="/aluno/treino" element={<p>tela treino do aluno</p>} />
          </Route>
          <Route element={<ProtectedRoute papel="professor" />}>
            <Route path="/professor/alunos" element={<p>tela alunos do professor</p>} />
          </Route>
        </Routes>
      </SessaoProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('sem sessao, leva a area do professor para o login do professor', () => {
    renderizarEm('/professor/alunos')

    expect(screen.getByText('tela login professor')).toBeInTheDocument()
  })

  it('deixa o professor entrar na area do professor', () => {
    renderizarEm('/professor/alunos', professor)

    expect(screen.getByText('tela alunos do professor')).toBeInTheDocument()
  })

  it('manda o aluno que tenta abrir a area do professor de volta para a dele', () => {
    renderizarEm('/professor/alunos', aluno)

    expect(screen.getByText('tela treino do aluno')).toBeInTheDocument()
  })
})

describe('GuestRoute', () => {
  it('tira quem ja esta logado da tela de login', () => {
    renderizarEm('/professor/login', professor)

    expect(screen.getByText('tela alunos do professor')).toBeInTheDocument()
  })
})
