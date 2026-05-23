const baseUrl = import.meta.env.VITE_BACKEND_URL

export const apiClient = {
  async loginAluno(matricula: string) {
    const response = await fetch(`${baseUrl}/api/auth/aluno/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula }),
    })

    if (!response.ok) {
      throw new Error('Matricula nao encontrada.')
    }

    return response.json() as Promise<{
      aluno: { id: number; matricula: string; nome: string; objetivo: string }
    }>
  },
}
