import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import type { ExercicioTreino } from '../treino.dto'

type ExercicioContextoValor = {
  exercicio: ExercicioTreino
  expandido: boolean
  concluido: boolean
  seriesConcluidas: string[]
  aoAlternar: () => void
}

const ExercicioContexto = createContext<ExercicioContextoValor | null>(null)

function useExercicio() {
  const contexto = useContext(ExercicioContexto)

  if (!contexto) {
    throw new Error('Exercicio.* deve ser usado dentro de <Exercicio.Root>.')
  }

  return contexto
}

function ExercicioRoot({
  children,
  ...valor
}: PropsWithChildren<ExercicioContextoValor>) {
  return (
    <ExercicioContexto.Provider value={valor}>
      <article
        className={[
          'rounded-[var(--radius-card)] border bg-white transition',
          valor.concluido
            ? 'border-[var(--color-accent-strong)]'
            : 'border-[var(--color-border-soft)]',
        ].join(' ')}
      >
        {children}
      </article>
    </ExercicioContexto.Provider>
  )
}

function ExercicioCabecalho() {
  const { exercicio, expandido, concluido, seriesConcluidas, aoAlternar } =
    useExercicio()

  return (
    <button
      type="button"
      onClick={aoAlternar}
      aria-expanded={expandido}
      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
    >
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-[var(--color-text-strong)]">
          {exercicio.nome}
        </h3>
        <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
          {concluido
            ? 'Exercicio concluido'
            : `${seriesConcluidas.length}/${exercicio.series.length} series concluidas`}
        </p>
      </div>
      <span className="shrink-0 text-lg text-[var(--color-text-muted)]">
        {expandido ? '−' : '+'}
      </span>
    </button>
  )
}

function ExercicioCorpo({ children }: PropsWithChildren) {
  const { expandido } = useExercicio()

  if (!expandido) {
    return null
  }

  return (
    <div className="border-t border-[var(--color-border-soft)] px-4 py-4">
      {children}
    </div>
  )
}

function ExercicioNotas() {
  const { exercicio } = useExercicio()

  if (!exercicio.notas) {
    return null
  }

  return (
    <p className="mb-4 text-sm leading-6 text-[var(--color-text-base)]">
      {exercicio.notas}
    </p>
  )
}

type ExercicioSeriesProps = {
  aoAlternarSerie: (serieId: string) => void
}

function ExercicioSeries({ aoAlternarSerie }: ExercicioSeriesProps) {
  const { exercicio, seriesConcluidas } = useExercicio()
  const indiceUltimaConcluida = exercicio.series.reduce(
    (maiorIndice, serie, indice) =>
      seriesConcluidas.includes(serie.id) ? indice : maiorIndice,
    -1,
  )

  return (
    <div className="grid gap-2">
      {exercicio.series.map((serie, indice) => {
        const concluida = seriesConcluidas.includes(serie.id)
        const podeAlternar = concluida
          ? indice === indiceUltimaConcluida
          : indice === indiceUltimaConcluida + 1

        return (
          <button
            key={serie.id}
            type="button"
            disabled={!podeAlternar}
            onClick={() => aoAlternarSerie(serie.id)}
            className={[
              'flex flex-col items-start gap-1 rounded-[calc(var(--radius-card)-0.25rem)] border px-3 py-3 text-left transition sm:flex-row sm:items-center sm:justify-between',
              concluida
                ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-soft)]'
                : 'border-transparent bg-[var(--color-canvas)]',
              !podeAlternar
                ? 'cursor-not-allowed opacity-50'
                : 'shadow-[0_8px_18px_-16px_rgba(24,49,42,0.35)]',
            ].join(' ')}
          >
            <span className="text-sm font-medium text-[var(--color-text-strong)]">
              {serie.rotulo}
            </span>
            <span className="text-sm leading-5 text-[var(--color-text-base)] sm:text-right">
              {concluida
                ? 'Concluida'
                : podeAlternar
                  ? serie.repeticoes
                  : `${serie.repeticoes} · Aguardando anterior`}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type ExercicioAcoesProps = {
  aoConcluir: () => void
}

function ExercicioAcoes({ aoConcluir }: ExercicioAcoesProps) {
  const { concluido } = useExercicio()

  if (concluido) {
    return null
  }

  return (
    <button
      type="button"
      onClick={aoConcluir}
      className="mt-4 mx-auto flex h-11 w-full max-w-56 items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-accent-strong)] px-4 text-sm font-semibold text-[var(--color-accent-strong)]"
    >
      Concluir exercicio
    </button>
  )
}

export const Exercicio = {
  Root: ExercicioRoot,
  Cabecalho: ExercicioCabecalho,
  Corpo: ExercicioCorpo,
  Notas: ExercicioNotas,
  Series: ExercicioSeries,
  Acoes: ExercicioAcoes,
}
