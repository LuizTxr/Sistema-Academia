import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'

type AbasDiasSemanaContextoValor = {
  diaSelecionadoId: string
  aoSelecionar: (diaId: string) => void
}

const AbasDiasSemanaContexto =
  createContext<AbasDiasSemanaContextoValor | null>(null)

function useAbasDiasSemana() {
  const contexto = useContext(AbasDiasSemanaContexto)

  if (!contexto) {
    throw new Error(
      'AbasDiasSemana.* deve ser usado dentro de <AbasDiasSemana.Root>.',
    )
  }

  return contexto
}

function AbasDiasSemanaRoot({
  children,
  ...valor
}: PropsWithChildren<AbasDiasSemanaContextoValor>) {
  return (
    <AbasDiasSemanaContexto.Provider value={valor}>
      <div className="grid grid-cols-4 gap-2">{children}</div>
    </AbasDiasSemanaContexto.Provider>
  )
}

type AbasDiasSemanaAbaProps = {
  dia: {
    id: string
    rotulo: string
    ativo: boolean
    marcado?: boolean
  }
}

function AbasDiasSemanaAba({ dia }: AbasDiasSemanaAbaProps) {
  const { diaSelecionadoId, aoSelecionar } = useAbasDiasSemana()
  const selecionado = dia.id === diaSelecionadoId

  return (
    <button
      type="button"
      disabled={!dia.ativo}
      aria-pressed={selecionado}
      onClick={() => aoSelecionar(dia.id)}
      className={[
        'relative h-11 rounded-[var(--radius-card)] border text-sm font-semibold transition',
        selecionado
          ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] text-white shadow-[var(--shadow-card)]'
          : 'border-[var(--color-border-soft)] bg-white text-[var(--color-text-strong)] shadow-[0_8px_18px_-16px_rgba(24,49,42,0.35)]',
        !dia.ativo
          ? 'cursor-not-allowed border-dashed border-[var(--color-border-soft)] bg-transparent text-[var(--color-text-muted)] opacity-60 shadow-none'
          : '',
      ].join(' ')}
    >
      {dia.rotulo}
      {dia.marcado && (
        <span
          aria-label="com treino"
          className={[
            'absolute top-1.5 right-1.5 size-1.5 rounded-full',
            selecionado ? 'bg-white' : 'bg-[var(--color-accent-strong)]',
          ].join(' ')}
        />
      )}
    </button>
  )
}

export const AbasDiasSemana = {
  Root: AbasDiasSemanaRoot,
  Aba: AbasDiasSemanaAba,
}
