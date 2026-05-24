export const apiClient = {
  baseUrl: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiClient.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Nao foi possivel concluir a requisicao.'

    try {
      const payload = (await response.json()) as { message?: string | string[] }
      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ')
      } else if (payload.message) {
        message = payload.message
      }
    } catch {
      // Mantem a mensagem padrao quando o backend nao devolve JSON.
    }

    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}
