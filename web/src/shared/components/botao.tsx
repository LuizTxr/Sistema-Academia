import type { ComponentProps } from 'react'

type EstiloDoBotao = {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'normal' | 'pequeno'
}

const estiloPorVariante = {
  primario:
    'bg-[var(--color-accent-strong)] bg-[image:var(--gradiente-acento)] text-white',
  secundario:
    'border border-[var(--color-accent-strong)] text-[var(--color-accent-strong)]',
  perigo: 'border border-[var(--color-danger)] text-[var(--color-danger)]',
}

const estiloPorTamanho = {
  normal: 'h-12 px-4',
  pequeno: 'h-9 px-3',
}

function montarClasses({
  variante = 'primario',
  tamanho = 'normal',
  className = '',
}: EstiloDoBotao & { className?: string }) {
  return [
    'flex items-center justify-center rounded-[var(--radius-card)] text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
    estiloPorVariante[variante],
    estiloPorTamanho[tamanho],
    className,
  ].join(' ')
}

type BotaoProps = ComponentProps<'button'> & EstiloDoBotao

export function Botao({
  variante,
  tamanho,
  type = 'button',
  className,
  ...props
}: BotaoProps) {
  return (
    <button
      type={type}
      className={montarClasses({ variante, tamanho, className })}
      {...props}
    />
  )
}
