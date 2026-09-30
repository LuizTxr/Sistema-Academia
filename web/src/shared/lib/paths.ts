export const paths = {
  aluno: {
    login: '/aluno/login',
    treino: '/aluno/treino',
  },
  professor: {
    login: '/professor/login',
    alunos: '/professor/alunos',
    novoAluno: '/professor/alunos/novo',
    treinosDoAluno: '/professor/alunos/:alunoId/treinos',
  },
} as const

export function caminhoTreinosDoAluno(alunoId: number) {
  return paths.professor.treinosDoAluno.replace(':alunoId', String(alunoId))
}
