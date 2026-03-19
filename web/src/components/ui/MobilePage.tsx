import type { PropsWithChildren } from 'react'

type MobilePageProps = PropsWithChildren<{
  title?: string
  subtitle?: string
}>

export function MobilePage({
  title,
  subtitle,
  children,
}: MobilePageProps) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[30rem] flex-col px-4 py-6">
      <section className="rounded-[var(--radius-panel)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
        {(title || subtitle) && (
          <header className="mb-6">
            {subtitle && (
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            )}
            {title && (
              <h1 className="mt-1 text-2xl font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-strong)]">
                {title}
              </h1>
            )}
          </header>
        )}

        {children}
      </section>
    </main>
  )
}
