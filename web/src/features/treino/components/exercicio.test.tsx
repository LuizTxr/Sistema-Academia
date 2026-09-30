import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ExercicioTreino } from '../treino.dto'
import { Exercicio } from './exercicio'

const supino: ExercicioTreino = {
  id: 'e1',
  nome: 'Supino reto',
  series: [
    { id: 's1', rotulo: 'Serie 1', repeticoes: '12 reps' },
    { id: 's2', rotulo: 'Serie 2', repeticoes: '12 reps' },
    { id: 's3', rotulo: 'Serie 3', repeticoes: '12 reps' },
  ],
}

type Opcoes = {
  expandido?: boolean
  concluido?: boolean
  seriesConcluidas?: string[]
  aoAlternarSerie?: (serieId: string) => void
}

function renderizar({
  expandido = true,
  concluido = false,
  seriesConcluidas = [],
  aoAlternarSerie = () => {},
}: Opcoes = {}) {
  return render(
    <Exercicio.Root
      exercicio={supino}
      expandido={expandido}
      concluido={concluido}
      seriesConcluidas={seriesConcluidas}
      aoAlternar={() => {}}
    >
      <Exercicio.Cabecalho />
      <Exercicio.Corpo>
        <Exercicio.Series aoAlternarSerie={aoAlternarSerie} />
        <Exercicio.Acoes aoConcluir={() => {}} />
      </Exercicio.Corpo>
    </Exercicio.Root>,
  )
}

function botaoDaSerie(rotulo: string) {
  return screen.getByRole('button', { name: new RegExp(rotulo) })
}

describe('Exercicio', () => {
  it('mostra o progresso das series no cabecalho', () => {
    renderizar({ seriesConcluidas: ['s1'] })

    expect(screen.getByText('1/3 series concluidas')).toBeInTheDocument()
  })

  it('esconde as series enquanto o exercicio nao esta expandido', () => {
    renderizar({ expandido: false })

    expect(screen.queryByText('Serie 1')).not.toBeInTheDocument()
  })

  it('libera so a primeira serie quando nada foi feito', () => {
    renderizar()

    expect(botaoDaSerie('Serie 1')).toBeEnabled()
    expect(botaoDaSerie('Serie 2')).toBeDisabled()
    expect(botaoDaSerie('Serie 3')).toBeDisabled()
  })

  it('libera a proxima e permite desmarcar so a ultima concluida', () => {
    renderizar({ seriesConcluidas: ['s1', 's2'] })

    expect(botaoDaSerie('Serie 1')).toBeDisabled()
    expect(botaoDaSerie('Serie 2')).toBeEnabled()
    expect(botaoDaSerie('Serie 3')).toBeEnabled()
  })

  it('chama aoAlternarSerie com o id da serie clicada', async () => {
    const aoAlternarSerie = vi.fn()
    renderizar({ aoAlternarSerie })

    await userEvent.click(botaoDaSerie('Serie 1'))

    expect(aoAlternarSerie).toHaveBeenCalledWith('s1')
  })

  it('esconde o botao de concluir quando o exercicio ja esta concluido', () => {
    renderizar({ concluido: true })

    expect(screen.queryByRole('button', { name: 'Concluir exercicio' })).not.toBeInTheDocument()
  })
})
