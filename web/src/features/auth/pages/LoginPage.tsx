import { MobilePage } from '../../../components/ui/MobilePage'

export function LoginPage() {
  return (
    <MobilePage title="Entrar com matricula" subtitle="Sistema Academia">
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-[var(--color-text-base)]">
          Estrutura inicial da feature de autenticacao pronta para receber o
          fluxo de login do aluno.
        </p>

        <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Proximo passo
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-base)]">
            Implementar o formulario de login por matricula e a persistencia da
            sessao local.
          </p>
        </div>
      </div>
    </MobilePage>
  )
}
