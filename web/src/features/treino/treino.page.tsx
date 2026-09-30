import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { AbasDiasSemana } from '@/shared/components/abas-dias-semana'
import { Exercicio } from './components/exercicio'
import { useTreino } from './treino.hook'

export function TreinoPage() {
  const {
    aluno,
    dias,
    diaSelecionado,
    diaSelecionadoId,
    exercicios,
    treinoConcluido,
    temAlteracoesPendentes,
    salvoEm,
    carregando,
    mensagemErro,
    selecionarDia,
    alternarExpansao,
    alternarSerie,
    concluirExercicio,
    salvarProgresso,
    sair,
  } = useTreino()

  return (
    <PaginaMobile.Root>
      <PaginaMobile.Cabecalho
        titulo={aluno.nome}
        subtitulo={aluno.objetivo}
        acao={
          <button
            type="button"
            onClick={sair}
            className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-border-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]"
          >
            Sair
          </button>
        }
      />

      <PaginaMobile.Corpo>
        <div className="grid gap-5">
          <p className="text-sm leading-5 text-[var(--color-text-base)]">
            Confira seus treinos abaixo.
          </p>

          {carregando ? (
            <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
              Carregando treino...
            </p>
          ) : mensagemErro ? (
            <p className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-4 text-sm text-[var(--color-danger)]">
              {mensagemErro}
            </p>
          ) : diaSelecionado ? (
            <>
              <AbasDiasSemana.Root
                diaSelecionadoId={diaSelecionadoId}
                aoSelecionar={selecionarDia}
              >
                {dias.map((dia) => (
                  <AbasDiasSemana.Aba key={dia.id} dia={dia} />
                ))}
              </AbasDiasSemana.Root>

              <section className="grid gap-4">
                <header className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    {diaSelecionado.rotulo}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
                      {diaSelecionado.titulo}
                    </h2>
                    {treinoConcluido && (
                      <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-strong)]">
                        Treino concluido
                      </span>
                    )}
                  </div>
                </header>

                <div className="grid gap-3">
                  {exercicios.map(
                    ({ exercicio, concluido, seriesConcluidas, expandido }) => (
                      <Exercicio.Root
                        key={exercicio.id}
                        exercicio={exercicio}
                        expandido={expandido}
                        concluido={concluido}
                        seriesConcluidas={seriesConcluidas}
                        aoAlternar={() => alternarExpansao(exercicio.id)}
                      >
                        <Exercicio.Cabecalho />
                        <Exercicio.Corpo>
                          <Exercicio.Notas />
                          <Exercicio.Series
                            aoAlternarSerie={(serieId) =>
                              alternarSerie(exercicio.id, serieId)
                            }
                          />
                          <Exercicio.Acoes
                            aoConcluir={() => concluirExercicio(exercicio.id)}
                          />
                        </Exercicio.Corpo>
                      </Exercicio.Root>
                    ),
                  )}
                </div>
              </section>
            </>
          ) : (
            <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
              Nenhum treino encontrado para este aluno.
            </p>
          )}

          {salvoEm && (
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Progresso salvo as {salvoEm}.
            </p>
          )}

          {diaSelecionado && temAlteracoesPendentes && (
            <button
              type="button"
              onClick={salvarProgresso}
              className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-accent-strong)] px-4 text-sm font-semibold text-white transition active:scale-[0.99]"
            >
              Salvar progresso
            </button>
          )}
        </div>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
