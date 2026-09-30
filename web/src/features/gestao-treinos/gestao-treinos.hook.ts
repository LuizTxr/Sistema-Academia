import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { paths } from '@/shared/lib/paths'
import { useSessaoProfessor } from '@/shared/sessao/sessao.hook'
import type {
  AlunoResumo,
  DadosItem,
  ExercicioCatalogo,
  ItemTreino,
  TreinoAluno,
} from './gestao-treinos.dto'
import {
  adicionarItem,
  atualizarItem,
  atualizarTreino,
  buscarAluno,
  criarTreino,
  listarExercicios,
  listarTreinosDoAluno,
  removerItem,
  removerTreino,
} from './gestao-treinos.service'

export const diasDaSemana = [
  { id: 'seg', rotulo: 'Seg' },
  { id: 'ter', rotulo: 'Ter' },
  { id: 'qua', rotulo: 'Qua' },
  { id: 'qui', rotulo: 'Qui' },
  { id: 'sex', rotulo: 'Sex' },
  { id: 'sab', rotulo: 'Sab' },
  { id: 'dom', rotulo: 'Dom' },
]

const idsPorDiaDoJs = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

export type CamposTreino = {
  nome: string
  objetivo: string
}

export type CamposItem = {
  exercicioId: string
  series: string
  repeticoes: string
  carga: string
  descanso: string
  observacao: string
}

export type ErrosTreino = Partial<Record<keyof CamposTreino, string>>
export type ErrosItem = Partial<Record<keyof CamposItem, string>>

export type Formulario =
  | { tipo: 'treino' }
  | { tipo: 'item'; item: ItemTreino | null }

export type Remocao = { tipo: 'treino' } | { tipo: 'item'; itemId: number }

export const camposItemVazio: CamposItem = {
  exercicioId: '',
  series: '3',
  repeticoes: '12',
  carga: '',
  descanso: '',
  observacao: '',
}

export function treinoDoDia(treinos: TreinoAluno[], diaId: string) {
  return treinos.find((treino) => treino.diaSemana === diaId)
}

export function escolherDiaInicial(treinos: TreinoAluno[], hojeId: string) {
  if (treinoDoDia(treinos, hojeId)) {
    return hojeId
  }

  return (
    diasDaSemana.find((dia) => treinoDoDia(treinos, dia.id))?.id ?? hojeId
  )
}

export function proximaOrdem(treino: TreinoAluno) {
  const maior = treino.exercicios.reduce(
    (atual, item) => Math.max(atual, item.ordem ?? 0),
    0,
  )

  return maior + 1
}

export function agruparExercicios(catalogo: ExercicioCatalogo[]) {
  const grupos = new Map<string, ExercicioCatalogo[]>()

  for (const exercicio of catalogo) {
    grupos.set(exercicio.grupoMuscular, [
      ...(grupos.get(exercicio.grupoMuscular) ?? []),
      exercicio,
    ])
  }

  return [...grupos.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([grupo, exercicios]) => ({
      grupo,
      exercicios: exercicios.sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR'),
      ),
    }))
}

export function validarCamposTreino(campos: CamposTreino): ErrosTreino {
  const erros: ErrosTreino = {}

  if (!campos.nome.trim()) {
    erros.nome = 'Informe o nome do treino.'
  }

  if (!campos.objetivo.trim()) {
    erros.objetivo = 'Informe o objetivo do treino.'
  }

  return erros
}

function converterNumero(texto: string) {
  return Number(texto.trim().replace(',', '.'))
}

export function validarCamposItem(campos: CamposItem): ErrosItem {
  const erros: ErrosItem = {}

  if (!campos.exercicioId) {
    erros.exercicioId = 'Escolha um exercicio.'
  }

  if (!/^\d+$/.test(campos.series.trim()) || Number(campos.series) < 1) {
    erros.series = 'Informe 1 ou mais series.'
  }

  if (!/^\d+$/.test(campos.repeticoes.trim()) || Number(campos.repeticoes) < 1) {
    erros.repeticoes = 'Informe 1 ou mais repeticoes.'
  }

  if (
    campos.carga.trim() &&
    (Number.isNaN(converterNumero(campos.carga)) ||
      converterNumero(campos.carga) < 0)
  ) {
    erros.carga = 'Informe a carga em kg (numero).'
  }

  if (campos.descanso.trim() && !/^\d+$/.test(campos.descanso.trim())) {
    erros.descanso = 'Informe o descanso em segundos (numero inteiro).'
  }

  return erros
}

export function montarDadosItem(campos: CamposItem): DadosItem {
  return {
    exercicioId: Number(campos.exercicioId),
    series: Number(campos.series),
    repeticoes: Number(campos.repeticoes),
    carga: campos.carga.trim() ? converterNumero(campos.carga) : null,
    descanso: campos.descanso.trim() ? Number(campos.descanso) : null,
    observacao: campos.observacao.trim(),
  }
}

export function camposDoItem(item: ItemTreino): CamposItem {
  return {
    exercicioId: String(item.exercicioId),
    series: String(item.series),
    repeticoes: String(item.repeticoes),
    carga: item.carga === null ? '' : String(item.carga),
    descanso: item.descanso === null ? '' : String(item.descanso),
    observacao: item.observacao ?? '',
  }
}

export function useGestaoTreinos() {
  const { sessao, sair } = useSessaoProfessor()
  const navigate = useNavigate()
  const { alunoId: alunoIdDaRota } = useParams()
  const alunoId = Number(alunoIdDaRota)

  const [aluno, setAluno] = useState<AlunoResumo | null>(null)
  const [treinos, setTreinos] = useState<TreinoAluno[]>([])
  const [catalogo, setCatalogo] = useState<ExercicioCatalogo[]>([])
  const [diaSelecionadoId, setDiaSelecionadoId] = useState(
    () => idsPorDiaDoJs[new Date().getDay()],
  )
  const [formulario, setFormulario] = useState<Formulario | null>(null)
  const [remocao, setRemocao] = useState<Remocao | null>(null)
  const [errosTreino, setErrosTreino] = useState<ErrosTreino>({})
  const [errosItem, setErrosItem] = useState<ErrosItem>({})
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [erroDaAcao, setErroDaAcao] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      if (!Number.isInteger(alunoId) || alunoId <= 0) {
        setMensagemErro('Aluno invalido.')
        setCarregando(false)
        return
      }

      try {
        const [alunoCarregado, treinosCarregados, catalogoCarregado] =
          await Promise.all([
            buscarAluno(alunoId),
            listarTreinosDoAluno(alunoId),
            listarExercicios(),
          ])

        if (cancelado) {
          return
        }

        setAluno(alunoCarregado)
        setTreinos(treinosCarregados)
        setCatalogo(catalogoCarregado)
        setDiaSelecionadoId((hojeId) =>
          escolherDiaInicial(treinosCarregados, hojeId),
        )
      } catch (erro) {
        if (!cancelado) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : 'Nao foi possivel carregar os treinos do aluno.',
          )
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    carregar()

    return () => {
      cancelado = true
    }
  }, [alunoId])

  const treinoSelecionado = treinoDoDia(treinos, diaSelecionadoId)
  const dias = diasDaSemana.map((dia) => ({
    ...dia,
    ativo: true,
    marcado: Boolean(treinoDoDia(treinos, dia.id)),
  }))
  const objetivoSugerido = treinos[0]?.objetivo ?? ''

  function limparEstadoDeEdicao() {
    setFormulario(null)
    setRemocao(null)
    setErrosTreino({})
    setErrosItem({})
    setErroDaAcao(null)
  }

  async function executar(acao: () => Promise<void>) {
    setOcupado(true)
    setErroDaAcao(null)

    try {
      await acao()
      setTreinos(await listarTreinosDoAluno(alunoId))
      return true
    } catch (erro) {
      setErroDaAcao(
        erro instanceof Error ? erro.message : 'Nao foi possivel concluir a acao.',
      )
      return false
    } finally {
      setOcupado(false)
    }
  }

  function selecionarDia(diaId: string) {
    setDiaSelecionadoId(diaId)
    limparEstadoDeEdicao()
  }

  function abrirFormularioTreino() {
    limparEstadoDeEdicao()
    setFormulario({ tipo: 'treino' })
    window.scrollTo({ top: 0 })
  }

  function abrirFormularioItem(item: ItemTreino | null) {
    limparEstadoDeEdicao()
    setFormulario({ tipo: 'item', item })
    window.scrollTo({ top: 0 })
  }

  async function salvarTreino(campos: CamposTreino) {
    const erros = validarCamposTreino(campos)
    setErrosTreino(erros)

    if (Object.keys(erros).length > 0) {
      return
    }

    const dados = { nome: campos.nome.trim(), objetivo: campos.objetivo.trim() }

    const sucesso = await executar(async () => {
      if (treinoSelecionado) {
        await atualizarTreino(treinoSelecionado.id, dados)
      } else {
        await criarTreino({
          ...dados,
          diaSemana: diaSelecionadoId,
          alunoId,
          professorId: sessao.id,
        })
      }
    })

    if (sucesso) {
      setFormulario(null)
    }
  }

  async function salvarItem(campos: CamposItem, item: ItemTreino | null) {
    const erros = validarCamposItem(campos)
    setErrosItem(erros)

    if (Object.keys(erros).length > 0 || !treinoSelecionado) {
      return
    }

    const dados = montarDadosItem(campos)

    const sucesso = await executar(async () => {
      if (item) {
        await atualizarItem(item.id, dados)
      } else {
        await adicionarItem({
          ...dados,
          treinoId: treinoSelecionado.id,
          ordem: proximaOrdem(treinoSelecionado),
        })
      }
    })

    if (sucesso) {
      setFormulario(null)
    }
  }

  async function confirmarRemocao() {
    if (!remocao) {
      return
    }

    const sucesso = await executar(async () => {
      if (remocao.tipo === 'treino' && treinoSelecionado) {
        await removerTreino(treinoSelecionado.id)
      } else if (remocao.tipo === 'item') {
        await removerItem(remocao.itemId)
      }
    })

    if (sucesso) {
      setRemocao(null)
    }
  }

  return {
    professor: sessao,
    aluno,
    dias,
    diaSelecionadoId,
    treinoSelecionado,
    catalogoAgrupado: agruparExercicios(catalogo),
    objetivoSugerido,
    formulario,
    remocao,
    errosTreino,
    errosItem,
    carregando,
    mensagemErro,
    erroDaAcao,
    ocupado,
    selecionarDia,
    abrirFormularioTreino,
    abrirFormularioItem,
    fecharFormulario: limparEstadoDeEdicao,
    solicitarRemocao: (pedido: Remocao) => {
      setFormulario(null)
      setErroDaAcao(null)
      setRemocao(pedido)
    },
    cancelarRemocao: () => setRemocao(null),
    salvarTreino,
    salvarItem,
    confirmarRemocao,
    voltar: () => navigate(paths.professor.alunos),
    sair,
  }
}
