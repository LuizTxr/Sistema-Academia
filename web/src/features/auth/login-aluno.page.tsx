import { LinkTexto } from '@/shared/components/link-texto'
import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { paths } from '@/shared/lib/paths'
import { useLoginAluno } from './login-aluno.hook'

export function LoginAlunoPage() {
  const { matricula, mensagemErro, enviando, alterarMatricula, enviar } =
    useLoginAluno()

  return (
    <PaginaMobile.Root>
      <PaginaMobile.Corpo>
        <div className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-center gap-8">
          <p className="absolute top-0 left-0 right-0 text-center text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Sistema Academia
          </p>

          <header className="grid gap-2 text-center">
            <p className="sr-only">Sistema Academia</p>
            <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-strong)]">
              Login
            </h1>
            <p className="mx-auto text-sm leading-5 text-[var(--color-text-base)]">
              Entre com sua matricula.
            </p>
          </header>

          <form className="grid gap-4" onSubmit={enviar}>
            <label className="grid gap-2" htmlFor="matricula">
              <input
                id="matricula"
                name="matricula"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                disabled={enviando}
                value={matricula}
                onChange={(evento) => alterarMatricula(evento.target.value)}
                placeholder="000000"
                className="h-12 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white px-4 text-center text-base text-[var(--color-text-strong)] outline-none transition focus:border-[var(--color-accent-strong)] focus:ring-2 focus:ring-[var(--color-accent-soft)]"
              />
            </label>

            {mensagemErro && (
              <p className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {mensagemErro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-accent-strong)] px-4 text-sm font-semibold text-white transition active:scale-[0.99]"
            >
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <LinkTexto to={paths.professor.login}>
            Acesse login de professores
          </LinkTexto>
        </div>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
