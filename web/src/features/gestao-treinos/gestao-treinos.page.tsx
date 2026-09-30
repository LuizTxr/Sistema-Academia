import { AbasDiasSemana } from '@/shared/components/abas-dias-semana'
import { Botao } from '@/shared/components/botao'
import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { FormularioItem } from './components/formulario-item'
import { FormularioTreino } from './components/formulario-treino'
import { ItemDoTreino } from './components/item-do-treino'
import { TreinoDoDia } from './components/treino-do-dia'
import {
  camposDoItem,
  camposItemVazio,
  useGestaoTreinos,
} from './gestao-treinos.hook'

export function GestaoTreinosPage() {
  const {
    aluno,
    dias,
    diaSelecionadoId,
    treinoSelecionado,
    catalogoAgrupado,
    objetivoSugerido,
    formulario,
    remocao,
    errosTreino,
    errosItem,
    carregando,
    mensagemErro,
    erroDaAcao,
    ocupado,
    selecionarDia,
    abrirFormularioTreino,
    abrirFormularioItem,
    fecharFormulario,
    solicitarRemocao,
    cancelarRemocao,
    salvarTreino,
    salvarItem,
    confirmarRemocao,
    voltar,
  } = useGestaoTreinos()

  const rotuloDoDia = dias.find((dia) => dia.id === diaSelecionadoId)?.rotulo

  const mensagemDeErroDaAcao = erroDaAcao && (
    <p
      role="alert"
      className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]"
    >
      {erroDaAcao}
    </p>
  )

  if (formulario) {
    const titulo =
      formulario.tipo === 'treino'
        ? treinoSelecionado
          ? 'Editar treino'
          : `Novo treino (${rotuloDoDia})`
        : formulario.item
          ? 'Editar exercicio'
          : 'Novo exercicio'

    return (
      <PaginaMobile.Root tema="professor">
        <PaginaMobile.Cabecalho
          titulo={aluno?.nome ?? 'Aluno'}
          subtitulo={titulo}
        />

        <PaginaMobile.Corpo>
          <div className="grid gap-4">
            {mensagemDeErroDaAcao}

            {formulario.tipo === 'treino' ? (
              <FormularioTreino
                key={`${diaSelecionadoId}-${treinoSelecionado?.id ?? 'novo'}`}
                valoresIniciais={
                  treinoSelecionado
                    ? {
                        nome: treinoSelecionado.nome,
                        objetivo: treinoSelecionado.objetivo,
                      }
                    : { nome: '', objetivo: objetivoSugerido }
                }
                erros={errosTreino}
                salvando={ocupado}
                aoSalvar={salvarTreino}
                aoCancelar={fecharFormulario}
              />
            ) : (
              <FormularioItem
                key={formulario.item?.id ?? 'novo'}
                catalogoAgrupado={catalogoAgrupado}
                valoresIniciais={
                  formulario.item
                    ? camposDoItem(formulario.item)
                    : camposItemVazio
                }
                erros={errosItem}
                salvando={ocupado}
                aoSalvar={(campos) => salvarItem(campos, formulario.item)}
                aoCancelar={fecharFormulario}
              />
            )}
          </div>
        </PaginaMobile.Corpo>
      </PaginaMobile.Root>
    )
  }

  return (
    <PaginaMobile.Root tema="professor">
      <PaginaMobile.Cabecalho
        titulo={aluno?.nome ?? 'Aluno'}
        subtitulo="Treinos da semana"
        aoVoltar={voltar}
      />

      <PaginaMobile.Corpo>
        <div className="grid gap-4">
          {carregando ? (
            <p
              role="status"
              className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]"
            >
              Carregando treinos...
            </p>
          ) : mensagemErro ? (
            <p
              role="alert"
              className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-4 text-sm text-[var(--color-danger)]"
            >
              {mensagemErro}
            </p>
          ) : (
            <>
              <AbasDiasSemana.Root
                diaSelecionadoId={diaSelecionadoId}
                aoSelecionar={selecionarDia}
              >
                {dias.map((dia) => (
                  <AbasDiasSemana.Aba key={dia.id} dia={dia} />
                ))}
              </AbasDiasSemana.Root>

              {mensagemDeErroDaAcao}

              {treinoSelecionado ? (
                <>
                  <TreinoDoDia.Root treino={treinoSelecionado}>
                    <TreinoDoDia.Cabecalho
                      ocupado={ocupado}
                      confirmandoRemocao={remocao?.tipo === 'treino'}
                      aoEditar={abrirFormularioTreino}
                      aoRemover={() => solicitarRemocao({ tipo: 'treino' })}
                      aoConfirmarRemocao={confirmarRemocao}
                      aoCancelarRemocao={cancelarRemocao}
                    />
                    <TreinoDoDia.Itens>
                      {treinoSelecionado.exercicios.map((item) => (
                        <ItemDoTreino
                          key={item.id}
                          item={item}
                          ocupado={ocupado}
                          confirmandoRemocao={
                            remocao?.tipo === 'item' && remocao.itemId === item.id
                          }
                          aoEditar={() => abrirFormularioItem(item)}
                          aoRemover={() =>
                            solicitarRemocao({ tipo: 'item', itemId: item.id })
                          }
                          aoConfirmarRemocao={confirmarRemocao}
                          aoCancelarRemocao={cancelarRemocao}
                        />
                      ))}
                    </TreinoDoDia.Itens>
                  </TreinoDoDia.Root>

                  <Botao
                    disabled={ocupado}
                    onClick={() => abrirFormularioItem(null)}
                  >
                    Adicionar exercicio
                  </Botao>
                </>
              ) : (
                <div className="grid gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-soft)] p-4">
                  <p className="text-sm text-[var(--color-text-base)]">
                    Sem treino neste dia ({rotuloDoDia}).
                  </p>
                  <Botao onClick={abrirFormularioTreino}>Adicionar treino</Botao>
                </div>
              )}
            </>
          )}
        </div>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
