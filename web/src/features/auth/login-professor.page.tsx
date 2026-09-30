import { Botao } from '@/shared/components/botao'
import { Campo } from '@/shared/components/campo'
import { LinkTexto } from '@/shared/components/link-texto'
import { PaginaMobile } from '@/shared/components/pagina-mobile'
import { paths } from '@/shared/lib/paths'
import { useLoginProfessor } from './login-professor.hook'

export function LoginProfessorPage() {
  const {
    email,
    senha,
    mensagemErro,
    enviando,
    alterarEmail,
    alterarSenha,
    enviar,
  } = useLoginProfessor()

  return (
    <PaginaMobile.Root tema="professor">
      <PaginaMobile.Corpo>
        <div className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-center gap-8">
          <p className="absolute top-0 left-0 right-0 text-center text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Sistema Academia
          </p>

          <header className="grid gap-2 text-center">
            <h1 className="bg-[image:var(--gradiente-acento)] bg-clip-text text-3xl font-semibold tracking-[var(--tracking-tight)] text-transparent">
              Login
            </h1>
            <p className="mx-auto text-sm leading-5 text-[var(--color-text-base)]">
              Entre com seu e-mail e sua senha.
            </p>
          </header>

          <form className="grid gap-4" onSubmit={enviar}>
            <Campo
              centralizado
              rotulo="E-mail"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="seu@email.com"
              disabled={enviando}
              value={email}
              onChange={(evento) => alterarEmail(evento.target.value)}
            />
            <Campo
              centralizado
              rotulo="Senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              disabled={enviando}
              value={senha}
              onChange={(evento) => alterarSenha(evento.target.value)}
            />

            {mensagemErro && (
              <p
                role="alert"
                className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-3 text-center text-sm text-[var(--color-danger)]"
              >
                {mensagemErro}
              </p>
            )}

            <Botao type="submit" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </Botao>
          </form>

          <LinkTexto to={paths.aluno.login}>Acesse login de alunos</LinkTexto>
        </div>
      </PaginaMobile.Corpo>
    </PaginaMobile.Root>
  )
}
