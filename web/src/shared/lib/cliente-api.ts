export const clienteApi = {
  urlBase: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
}

export class ErroApi extends Error {
  status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

export async function requisicaoApi<T>(
  caminho: string,
  init?: RequestInit,
): Promise<T> {
  const resposta = await fetch(`${clienteApi.urlBase}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!resposta.ok) {
    let mensagem = 'Nao foi possivel concluir a requisicao.'

    try {
      const corpo = (await resposta.json()) as { message?: string | string[] }
      if (Array.isArray(corpo.message)) {
        mensagem = corpo.message.join(', ')
      } else if (corpo.message) {
        mensagem = corpo.message
      }
    } catch {
      // Mantem a mensagem padrao quando o backend nao devolve JSON.
    }

    throw new ErroApi(mensagem, resposta.status)
  }

  return resposta.json() as Promise<T>
}
