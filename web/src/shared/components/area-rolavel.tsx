import type { ComponentProps } from 'react'

// Ocupa o espaco que sobrar no pai e rola por dentro. O pai precisa ser uma
// coluna flex com altura limitada (ex.: <PaginaMobile.Root preencherTela>).
export function AreaRolavel({
  className = '',
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={`-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-1 [scrollbar-color:var(--color-border-soft)_transparent] [scrollbar-width:thin] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
