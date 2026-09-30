import { useId } from 'react'
import type { ComponentProps } from 'react'

const estiloDoControle =
  'h-12 w-full rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white px-4 text-base text-[var(--color-text-strong)] outline-none transition focus:border-[var(--color-accent-strong)] focus:ring-2 focus:ring-[var(--color-accent-soft)] disabled:opacity-60'

type CampoProps = ComponentProps<'input'> & {
  rotulo: string
  erro?: string
  centralizado?: boolean
}

export function Campo({
  rotulo,
  erro,
  centralizado = false,
  id,
  className = '',
  ...props
}: CampoProps) {
  const idGerado = useId()
  const idDoCampo = id ?? idGerado

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={idDoCampo}
        className={`text-sm font-medium text-[var(--color-text-strong)] ${centralizado ? 'text-center' : ''}`}
      >
        {rotulo}
      </label>
      <input
        id={idDoCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${idDoCampo}-erro` : undefined}
        className={`${estiloDoControle} ${centralizado ? 'text-center' : ''} ${className}`}
        {...props}
      />
      {erro && (
        <p
          id={`${idDoCampo}-erro`}
          className={`text-sm text-[var(--color-danger)] ${centralizado ? 'text-center' : ''}`}
        >
          {erro}
        </p>
      )}
    </div>
  )
}

type CampoSelecaoProps = ComponentProps<'select'> & {
  rotulo: string
  erro?: string
}

export function CampoSelecao({
  rotulo,
  erro,
  id,
  className = '',
  children,
  ...props
}: CampoSelecaoProps) {
  const idGerado = useId()
  const idDoCampo = id ?? idGerado

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={idDoCampo}
        className="text-sm font-medium text-[var(--color-text-strong)]"
      >
        {rotulo}
      </label>
      <select
        id={idDoCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${idDoCampo}-erro` : undefined}
        className={`${estiloDoControle} ${className}`}
        {...props}
      >
        {children}
      </select>
      {erro && (
        <p id={`${idDoCampo}-erro`} className="text-sm text-[var(--color-danger)]">
          {erro}
        </p>
      )}
    </div>
  )
}
