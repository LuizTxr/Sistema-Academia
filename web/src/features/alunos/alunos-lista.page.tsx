import { AreaRolavel } from '@/shared/components/area-rolavel'
import { Botao } from '@/shared/components/botao'
import { Campo } from '@/shared/components/campo'
import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { useAlunosLista } from './alunos-lista.hook'

export function AlunosListaPage() {
  const {
    professor,
    totalDeAlunos,
    alunos,
    busca,
    carregando,
    mensagemErro,
    alterarBusca,
    abrirTreinos,
    irParaCadastro,
    sair,
  } = useAlunosLista()

  return (
    <PaginaMobile.Root tema="professor" preencherTela>
      <PaginaMobile.Cabecalho
        titulo="Alunos"
        subtitulo={professor.nome}
        acao={
          <Botao variante="secundario" tamanho="pequeno" onClick={sair}>
            Sair
          </Botao>
        }
      />

      <PaginaMobile.Corpo>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <Botao className="shrink-0" onClick={irParaCadastro}>
            Novo aluno
          </Botao>

          <Campo
            rotulo="Buscar aluno por nome"
            type="search"
            placeholder="Digite o nome"
            value={busca}
            onChange={(evento) => alterarBusca(evento.target.value)}
          />

          {!carregando && !mensagemErro && alunos.length > 0 && (
            <p className="shrink-0 text-sm text-[var(--color-text-muted)]">
              {alunos.length} de {totalDeAlunos} alunos
            </p>
          )}

          <AreaRolavel>
            {carregando ? (
              <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
                Carregando alunos...
              </p>
            ) : mensagemErro ? (
              <p
                role="alert"
                className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-4 text-sm text-[var(--color-danger)]"
              >
                {mensagemErro}
              </p>
            ) : alunos.length === 0 ? (
              <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
                {totalDeAlunos === 0
                  ? 'Nenhum aluno cadastrado ainda.'
                  : 'Nenhum aluno encontrado com esse nome.'}
              </p>
            ) : (
              <ul className="grid gap-2">
                {alunos.map((aluno) => (
                  <li key={aluno.id}>
                    <button
                      type="button"
                      onClick={() => abrirTreinos(aluno.id)}
                      className="grid w-full gap-1 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white px-4 py-3 text-left transition active:scale-[0.99]"
                    >
                      <span className="text-base font-semibold text-[var(--color-text-strong)]">
                        {aluno.nome}
                      </span>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        Matricula {aluno.matricula} · {aluno.email}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </AreaRolavel>
        </div>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
