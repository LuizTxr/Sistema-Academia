import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { caminhoTreinosDoAluno, paths } from '@/shared/lib/paths'
import { useSessaoProfessor } from '@/shared/sessao/sessao.hook'
import type { Aluno } from './alunos.dto'
import { listarAlunos } from './alunos.service'

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function filtrarAlunosPorNome(alunos: Aluno[], busca: string) {
  const termo = normalizarTexto(busca)

  if (!termo) {
    return alunos
  }

  return alunos.filter((aluno) => normalizarTexto(aluno.nome).includes(termo))
}

export function useAlunosLista() {
  const { sessao, sair } = useSessaoProfessor()
  const navigate = useNavigate()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    async function carregarAlunos() {
      try {
        const lista = await listarAlunos()

        if (!cancelado) {
          setAlunos(lista)
        }
      } catch (erro) {
        if (!cancelado) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : 'Nao foi possivel carregar os alunos.',
          )
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    carregarAlunos()

    return () => {
      cancelado = true
    }
  }, [])

  const alunosFiltrados = filtrarAlunosPorNome(alunos, busca)
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  return {
    professor: sessao,
    totalDeAlunos: alunos.length,
    alunos: alunosFiltrados,
    busca,
    carregando,
    mensagemErro,
    alterarBusca: setBusca,
    abrirTreinos: (alunoId: number) => navigate(caminhoTreinosDoAluno(alunoId)),
    irParaCadastro: () => navigate(paths.professor.novoAluno),
    sair,
  }
}
