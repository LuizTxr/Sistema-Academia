import { Botao } from '@/shared/components/botao'
import type { ItemTreino } from '../gestao-treinos.dto'

type ItemDoTreinoProps = {
  item: ItemTreino
  ocupado: boolean
  confirmandoRemocao: boolean
  aoEditar: () => void
  aoRemover: () => void
  aoConfirmarRemocao: () => void
  aoCancelarRemocao: () => void
}

export function ItemDoTreino({
  item,
  ocupado,
  confirmandoRemocao,
  aoEditar,
  aoRemover,
  aoConfirmarRemocao,
  aoCancelarRemocao,
}: ItemDoTreinoProps) {
  const detalhes = [
    `${item.series} x ${item.repeticoes}`,
    item.carga !== null ? `${item.carga} kg` : null,
    item.descanso !== null ? `${item.descanso} s de descanso` : null,
  ].filter(Boolean)

  return (
    <li className="grid gap-2 rounded-[var(--radius-card)] bg-[var(--color-canvas)] px-4 py-3">
      <div>
        <p className="text-base font-semibold text-[var(--color-text-strong)]">
          {item.exercicio.nome}
        </p>
        <p className="text-sm text-[var(--color-text-base)]">
          {detalhes.join(' · ')}
        </p>
        {item.observacao && (
          <p className="text-sm italic text-[var(--color-text-muted)]">
            {item.observacao}
          </p>
        )}
      </div>

      {confirmandoRemocao ? (
        <div className="grid gap-2">
          <p className="text-sm text-[var(--color-text-strong)]">
            Remover este exercicio do treino?
          </p>
          <div className="flex gap-2">
            <Botao
              variante="perigo"
              tamanho="pequeno"
              disabled={ocupado}
              onClick={aoConfirmarRemocao}
            >
              Confirmar
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
            Editar
          </Botao>
          <Botao
            variante="perigo"
            tamanho="pequeno"
            disabled={ocupado}
            onClick={aoRemover}
          >
            Remover
          </Botao>
        </div>
      )}
    </li>
  )
}
