import { createContext, useContext } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { Botao } from './botao'

type PaginaMobileContextoValor = {
  preencherTela: boolean
}

const PaginaMobileContexto = createContext<PaginaMobileContextoValor>({
  preencherTela: false,
})

type PaginaMobileRootProps = PropsWithChildren<{
  tema?: 'professor'
  // Ocupa exatamente a altura da tela, sem rolar a pagina. Quem precisar
  // de rolagem usa <AreaRolavel> dentro do <PaginaMobile.Corpo>.
  preencherTela?: boolean
}>

function PaginaMobileRoot({
  tema,
  preencherTela = false,
  children,
}: PaginaMobileRootProps) {
  return (
    <PaginaMobileContexto.Provider value={{ preencherTela }}>
      <main
        data-tema={tema}
        className={[
          'mx-auto flex w-full max-w-[30rem] flex-col px-4',
          preencherTela ? 'h-dvh overflow-hidden py-4' : 'min-h-svh py-6',
        ].join(' ')}
      >
        <section
          className={[
            'rounded-[var(--radius-panel)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] bg-[image:var(--fundo-painel)] p-5 shadow-[var(--shadow-card)]',
            preencherTela ? 'flex min-h-0 flex-1 flex-col' : '',
          ].join(' ')}
        >
          {children}
        </section>
      </main>
    </PaginaMobileContexto.Provider>
  )
}

type PaginaMobileCabecalhoProps = {
  titulo?: string
  subtitulo?: string
  // Mostra o botao "Voltar" sempre no canto esquerdo.
  aoVoltar?: () => void
  // Outras acoes (ex.: "Sair") ficam sempre no canto direito.
  acao?: ReactNode
}

function PaginaMobileCabecalho({
  titulo,
  subtitulo,
  aoVoltar,
  acao,
}: PaginaMobileCabecalhoProps) {
  return (
    <header className="mb-6 grid shrink-0 grid-cols-[5rem_1fr_5rem] items-center gap-2">
      <div className="justify-self-start">
        {aoVoltar && (
          <Botao variante="secundario" tamanho="pequeno" onClick={aoVoltar}>
            Voltar
          </Botao>
        )}
      </div>

      <div className="text-center">
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

      <div className="justify-self-end">{acao}</div>
    </header>
  )
}

function PaginaMobileCorpo({ children }: PropsWithChildren) {
  const { preencherTela } = useContext(PaginaMobileContexto)

  return (
    <div className={preencherTela ? 'flex min-h-0 flex-1 flex-col' : ''}>
      {children}
    </div>
  )
}

export const PaginaMobile = {
  Root: PaginaMobileRoot,
  Cabecalho: PaginaMobileCabecalho,
  Corpo: PaginaMobileCorpo,
}
