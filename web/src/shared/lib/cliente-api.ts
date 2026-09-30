import { lerSessao } from '@/shared/sessao/sessao.service'

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

type OpcoesRequisicao = RequestInit & {
  // Envia a identidade transitoria do professor (headers x-user-role e x-user-id).
  comoProfessor?: boolean
}

function montarHeadersDeIdentidade() {
  const sessao = lerSessao()

  if (sessao?.papel !== 'professor') {
    throw new ErroApi('Sessao de professor nao encontrada. Entre novamente.', 401)
  }

  return {
    'x-user-role': 'professor',
    'x-user-id': String(sessao.id),
  }
}

export async function requisicaoApi<T>(
  caminho: string,
  { comoProfessor, headers, ...init }: OpcoesRequisicao = {},
): Promise<T> {
  const resposta = await fetch(`${clienteApi.urlBase}${caminho}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(comoProfessor ? montarHeadersDeIdentidade() : {}),
      ...(headers ?? {}),
    },
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

  const texto = await resposta.text()

  return (texto ? JSON.parse(texto) : undefined) as T
}
