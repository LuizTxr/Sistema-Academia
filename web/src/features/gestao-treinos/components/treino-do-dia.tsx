import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import { Botao } from '@/shared/components/botao'
import type { TreinoAluno } from '../gestao-treinos.dto'

type TreinoDoDiaContextoValor = {
  treino: TreinoAluno
}

const TreinoDoDiaContexto = createContext<TreinoDoDiaContextoValor | null>(null)

function useTreinoDoDia() {
  const contexto = useContext(TreinoDoDiaContexto)

  if (!contexto) {
    throw new Error('TreinoDoDia.* deve ser usado dentro de <TreinoDoDia.Root>.')
  }

  return contexto
}

function TreinoDoDiaRoot({
  children,
  ...valor
}: PropsWithChildren<TreinoDoDiaContextoValor>) {
  return (
    <TreinoDoDiaContexto.Provider value={valor}>
      <section className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white p-4">
        {children}
      </section>
    </TreinoDoDiaContexto.Provider>
  )
}

type TreinoDoDiaCabecalhoProps = {
  ocupado: boolean
  confirmandoRemocao: boolean
  aoEditar: () => void
  aoRemover: () => void
  aoConfirmarRemocao: () => void
  aoCancelarRemocao: () => void
}

function TreinoDoDiaCabecalho({
  ocupado,
  confirmandoRemocao,
  aoEditar,
  aoRemover,
  aoConfirmarRemocao,
  aoCancelarRemocao,
}: TreinoDoDiaCabecalhoProps) {
  const { treino } = useTreinoDoDia()

  return (
    <header className="grid gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
          {treino.nome}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Objetivo: {treino.objetivo}
        </p>
      </div>

      {confirmandoRemocao ? (
        <div className="grid gap-2 rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.08)] p-3">
          <p className="text-sm text-[var(--color-text-strong)]">
            Remover este treino e todos os exercicios dele?
          </p>
          <div className="flex gap-2">
            <Botao
              variante="perigo"
              tamanho="pequeno"
              disabled={ocupado}
              onClick={aoConfirmarRemocao}
            >
              Confirmar remocao
            </Botao>
            <Botao
              variante="secundario"
              tamanho="pequeno"
              disabled={ocupado}
              onClick={aoCancelarRemocao}
            >
              Cancelar
            </Botao>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Botao
            variante="secundario"
            tamanho="pequeno"
            disabled={ocupado}
            onClick={aoEditar}
          >
            Editar treino
          </Botao>
          <Botao
            variante="perigo"
            tamanho="pequeno"
            disabled={ocupado}
            onClick={aoRemover}
          >
            Remover treino
          </Botao>
        </div>
      )}
    </header>
  )
}

function TreinoDoDiaItens({ children }: PropsWithChildren) {
  const { treino } = useTreinoDoDia()

  if (treino.exercicios.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] px-4 py-3 text-sm text-[var(--color-text-base)]">
        Nenhum exercicio neste treino ainda.
      </p>
    )
  }

  return <ul className="grid gap-2">{children}</ul>
}

export const TreinoDoDia = {
  Root: TreinoDoDiaRoot,
  Cabecalho: TreinoDoDiaCabecalho,
  Itens: TreinoDoDiaItens,
}
