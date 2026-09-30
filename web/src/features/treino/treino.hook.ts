import { useEffect, useState } from 'react'
import { useSessaoAtiva } from '@/shared/sessao/sessao.hook'
import type {
  DiaTreino,
  ExercicioTreino,
  ProgressoDia,
  ProgressoPorDia,
} from './treino.dto'
import {
  buscarDiasTreino,
  gravarProgressoSalvo,
  gravarRascunho,
  lerProgressoSalvo,
  lerRascunho,
  removerProgresso,
} from './treino.service'

const idsDiaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

const progressoVazio: ProgressoDia = {
  seriesConcluidas: [],
  exerciciosConcluidos: [],
}

function idDiaDeHoje() {
  return idsDiaSemana[new Date().getDay()]
}

export function escolherDiaSelecionado(dias: DiaTreino[], idAtual: string) {
  const diaAtual = dias.find((dia) => dia.id === idAtual)

  if (diaAtual?.ativo) {
    return diaAtual.id
  }

  const idHoje = idDiaDeHoje()
  const indiceHoje = dias.findIndex((dia) => dia.id === idHoje)

  if (indiceHoje >= 0 && dias[indiceHoje]?.ativo) {
    return dias[indiceHoje].id
  }

  if (indiceHoje >= 0) {
    const proximoDiaAtivo = dias.slice(indiceHoje + 1).find((dia) => dia.ativo)

    if (proximoDiaAtivo) {
      return proximoDiaAtivo.id
    }
  }

  return dias.find((dia) => dia.ativo)?.id ?? dias[0]?.id ?? idAtual
}

export function exercicioEstaConcluido(
  exercicio: ExercicioTreino,
  progresso: ProgressoDia,
) {
  const todasSeriesConcluidas = exercicio.series.every((serie) =>
    progresso.seriesConcluidas.includes(serie.id),
  )

  return (
    todasSeriesConcluidas || progresso.exerciciosConcluidos.includes(exercicio.id)
  )
}

export function podeAlternarSerie(
  exercicio: ExercicioTreino,
  seriesConcluidas: string[],
  serieId: string,
) {
  const indiceAlvo = exercicio.series.findIndex((serie) => serie.id === serieId)
  const indiceUltimaConcluida = exercicio.series.reduce(
    (maiorIndice, serie, indice) =>
      seriesConcluidas.includes(serie.id) ? indice : maiorIndice,
    -1,
  )
  const jaConcluida = seriesConcluidas.includes(serieId)

  return jaConcluida
    ? indiceAlvo === indiceUltimaConcluida
    : indiceAlvo === indiceUltimaConcluida + 1
}

export function alternarSerie(
  progresso: ProgressoDia,
  exercicio: ExercicioTreino,
  serieId: string,
): ProgressoDia {
  if (!podeAlternarSerie(exercicio, progresso.seriesConcluidas, serieId)) {
    return progresso
  }

  const jaConcluida = progresso.seriesConcluidas.includes(serieId)
  const seriesConcluidas = jaConcluida
    ? progresso.seriesConcluidas.filter((id) => id !== serieId)
    : [...progresso.seriesConcluidas, serieId]
  const todasSeriesConcluidas = exercicio.series.every((serie) =>
    seriesConcluidas.includes(serie.id),
  )
  const exerciciosConcluidos = todasSeriesConcluidas
    ? Array.from(new Set([...progresso.exerciciosConcluidos, exercicio.id]))
    : progresso.exerciciosConcluidos.filter((id) => id !== exercicio.id)

  return { seriesConcluidas, exerciciosConcluidos }
}

export function concluirExercicio(
  progresso: ProgressoDia,
  exercicio: ExercicioTreino,
): ProgressoDia {
  return {
    seriesConcluidas: Array.from(
      new Set([
        ...progresso.seriesConcluidas,
        ...exercicio.series.map((serie) => serie.id),
      ]),
    ),
    exerciciosConcluidos: Array.from(
      new Set([...progresso.exerciciosConcluidos, exercicio.id]),
    ),
  }
}

export function useTreino() {
  const { sessao, sair: sairDaSessao } = useSessaoAtiva()
  const { matricula } = sessao

  const [dias, setDias] = useState<DiaTreino[]>([])
  const [diaSelecionadoId, setDiaSelecionadoId] = useState(idDiaDeHoje)
  const [exercicioExpandidoId, setExercicioExpandidoId] = useState<
    string | null
  >(null)
  const [rascunhoPorDia, setRascunhoPorDia] = useState<ProgressoPorDia>(
    () => lerRascunho(matricula) ?? {},
  )
  const [progressoSalvoPorDia, setProgressoSalvoPorDia] =
    useState<ProgressoPorDia>(() => lerProgressoSalvo(matricula) ?? {})
  const [salvoEm, setSalvoEm] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  const diaSelecionado =
    dias.find((dia) => dia.id === diaSelecionadoId) ?? dias[0]
  const exerciciosDoDia = diaSelecionado?.exercicios ?? []
  const rascunho = rascunhoPorDia[diaSelecionadoId] ?? progressoVazio
  const progressoSalvo = progressoSalvoPorDia[diaSelecionadoId] ?? progressoVazio

  const exercicios = exerciciosDoDia.map((exercicio) => ({
    exercicio,
    concluido: exercicioEstaConcluido(exercicio, rascunho),
    seriesConcluidas: exercicio.series
      .filter((serie) => rascunho.seriesConcluidas.includes(serie.id))
      .map((serie) => serie.id),
    expandido: exercicioExpandidoId === exercicio.id,
  }))
  const treinoConcluido =
    exercicios.length > 0 && exercicios.every((item) => item.concluido)
  const temAlteracoesPendentes =
    JSON.stringify(rascunho) !== JSON.stringify(progressoSalvo)

  useEffect(() => {
    let cancelado = false

    async function carregarDias() {
      setCarregando(true)
      setMensagemErro(null)

      try {
        const diasCarregados = await buscarDiasTreino(matricula)

        if (cancelado) {
          return
        }

        setDias(diasCarregados)
        setDiaSelecionadoId((idAtual) =>
          escolherDiaSelecionado(diasCarregados, idAtual),
        )
      } catch (erro) {
        if (!cancelado) {
          setMensagemErro(
            erro instanceof Error
              ? erro.message
              : 'Nao foi possivel carregar os treinos.',
          )
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    carregarDias()

    return () => {
      cancelado = true
    }
  }, [matricula])

  useEffect(() => {
    gravarRascunho(matricula, rascunhoPorDia)
  }, [matricula, rascunhoPorDia])

  function atualizarRascunho(atualizar: (progresso: ProgressoDia) => ProgressoDia) {
    setRascunhoPorDia((rascunhoAtual) => ({
      ...rascunhoAtual,
      [diaSelecionadoId]: atualizar(
        rascunhoAtual[diaSelecionadoId] ?? progressoVazio,
      ),
    }))
    setSalvoEm(null)
  }

  function selecionarDia(diaId: string) {
    setDiaSelecionadoId(diaId)
    setExercicioExpandidoId(null)
    setSalvoEm(null)
  }

  function alternarExpansao(exercicioId: string) {
    setExercicioExpandidoId((idAtual) =>
      idAtual === exercicioId ? null : exercicioId,
    )
  }

  function alternarSerieDoExercicio(exercicioId: string, serieId: string) {
    const exercicio = exerciciosDoDia.find((item) => item.id === exercicioId)

    if (!exercicio) {
      return
    }

    atualizarRascunho((progresso) => alternarSerie(progresso, exercicio, serieId))
  }

  function concluirExercicioDoDia(exercicioId: string) {
    const exercicio = exerciciosDoDia.find((item) => item.id === exercicioId)

    if (!exercicio) {
      return
    }

    atualizarRascunho((progresso) => concluirExercicio(progresso, exercicio))
  }

  function salvarProgresso() {
    const proximoProgressoSalvo: ProgressoPorDia = {
      ...progressoSalvoPorDia,
      [diaSelecionadoId]: {
        seriesConcluidas: [...rascunho.seriesConcluidas],
        exerciciosConcluidos: [...rascunho.exerciciosConcluidos],
      },
    }

    setProgressoSalvoPorDia(proximoProgressoSalvo)
    gravarProgressoSalvo(matricula, proximoProgressoSalvo)
    setSalvoEm(
      new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    )
  }

  function sair() {
    removerProgresso(matricula)
    sairDaSessao()
  }

  return {
    aluno: { nome: sessao.nome, objetivo: sessao.objetivo },
    dias,
    diaSelecionado,
    diaSelecionadoId,
    exercicios,
    treinoConcluido,
    temAlteracoesPendentes,
    salvoEm,
    carregando,
    mensagemErro,
    selecionarDia,
    alternarExpansao,
    alternarSerie: alternarSerieDoExercicio,
    concluirExercicio: concluirExercicioDoDia,
    salvarProgresso,
    sair,
  }
}
