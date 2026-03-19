function App() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[30rem] flex-col px-4 py-6">
      <section className="rounded-[var(--radius-panel)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Sistema Academia
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-strong)]">
              Base do frontend pronta
            </h1>
          </div>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-strong)]">
            MVP
          </span>
        </div>

        <p className="text-sm leading-6 text-[var(--color-text-base)]">
          O projeto agora esta configurado com React, Vite, Tailwind e
          variaveis globais de tema para iniciar a interface mobile first.
        </p>

        <div className="mt-6 grid gap-3">
          <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Proximo passo
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-base)]">
              Estruturar as features de autenticacao e treino.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Regra visual
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-base)]">
              Tokens centralizados em tema global e composicao sempre mobile
              first.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
