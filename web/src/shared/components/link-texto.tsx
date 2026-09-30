import type { ComponentProps } from 'react'
import { Link } from 'react-router'

export function LinkTexto({ className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`text-center text-sm font-medium text-[var(--color-accent-strong)] underline-offset-4 hover:underline ${className}`}
      {...props}
    />
  )
}
