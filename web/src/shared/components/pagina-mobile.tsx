import type { PropsWithChildren, ReactNode } from 'react'

function PaginaMobileRoot({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[30rem] flex-col px-4 py-6">
      <section className="rounded-[var(--radius-panel)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
        {children}
      </section>
    </main>
  )
}

type PaginaMobileCabecalhoProps = {
  titulo?: string
  subtitulo?: string
  acao?: ReactNode
}

function PaginaMobileCabecalho({
  titulo,
  subtitulo,
  acao,
}: PaginaMobileCabecalhoProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div>
        {subtitulo && (
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            {subtitulo}
          </p>
        )}
        {titulo && (
          <h1 className="mt-1 text-2xl font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-strong)]">
            {titulo}
          </h1>
        )}
      </div>
      {acao}
    </header>
  )
}

function PaginaMobileCorpo({ children }: PropsWithChildren) {
  return <div>{children}</div>
}

export const PaginaMobile = {
  Root: PaginaMobileRoot,
  Cabecalho: PaginaMobileCabecalho,
  Corpo: PaginaMobileCorpo,
}
