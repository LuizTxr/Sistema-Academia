import { Botao } from '@/shared/components/botao'
import { Campo } from '@/shared/components/campo'
import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { useAlunoCadastro } from './aluno-cadastro.hook'

export function AlunoCadastroPage() {
  const {
    campos,
    erros,
    mensagemErro,
    enviando,
    matriculaSugerida,
    alterarCampo,
    enviar,
    voltar,
  } = useAlunoCadastro()

  return (
    <PaginaMobile.Root tema="professor">
      <PaginaMobile.Cabecalho
        titulo="Novo aluno"
        subtitulo="Cadastro"
        aoVoltar={voltar}
      />

      <PaginaMobile.Corpo>
        <form className="grid gap-4" onSubmit={enviar} noValidate>
          <Campo
            rotulo="Nome"
            name="nome"
            autoComplete="off"
            disabled={enviando}
            value={campos.nome}
            erro={erros.nome}
            onChange={(evento) => alterarCampo('nome', evento.target.value)}
          />
          <Campo
            rotulo="E-mail"
            name="email"
            type="email"
            autoComplete="off"
            disabled={enviando}
            value={campos.email}
            erro={erros.email}
            onChange={(evento) => alterarCampo('email', evento.target.value)}
          />
          <div className="grid gap-1.5">
            <Campo
              rotulo="Matricula"
              name="matricula"
              inputMode="numeric"
              autoComplete="off"
              disabled={enviando}
              value={campos.matricula}
              erro={erros.matricula}
              onChange={(evento) =>
                alterarCampo('matricula', evento.target.value)
              }
            />
            {matriculaSugerida && !erros.matricula && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Sugerida a partir da maior matricula atual. Voce pode alterar.
              </p>
            )}
          </div>
          <Campo
            rotulo="Telefone (opcional)"
            name="telefone"
            type="tel"
            autoComplete="off"
            disabled={enviando}
            value={campos.telefone}
            onChange={(evento) => alterarCampo('telefone', evento.target.value)}
          />

          {mensagemErro && (
            <p
              role="alert"
              className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]"
            >
              {mensagemErro}
            </p>
          )}

          <Botao type="submit" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Cadastrar aluno'}
          </Botao>
        </form>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
