// Contrato da API: os campos ja vem em portugues, entao o modelo e o proprio DTO.
export type Aluno = {
  id: number
  nome: string
  email: string
  matricula: string
  telefone: string | null
}

export type NovoAluno = {
  nome: string
  email: string
  matricula: string
  telefone?: string
}
