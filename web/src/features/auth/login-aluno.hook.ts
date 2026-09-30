import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '@/shared/lib/paths'
import { useSessao } from '@/shared/sessao/sessao.hook'
import { entrarAluno } from './auth.service'

export function useLogin() {
  const { entrar } = useSessao()
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function alterarMatricula(valor: string) {
    setMatricula(valor.replace(/\D/g, ''))

    if (mensagemErro) {
      setMensagemErro('')
    }
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const matriculaNormalizada = matricula.trim()

    if (!matriculaNormalizada) {
      setMensagemErro('Informe sua matricula para entrar.')
      return
    }

    setEnviando(true)

    try {
      const sessao = await entrarAluno(matriculaNormalizada)
      entrar(sessao)
      navigate(paths.aluno.treino, { replace: true })
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Nao foi possivel entrar.',
      )
      setEnviando(false)
    }
  }

  return {
    matricula,
    mensagemErro,
    enviando,
    alterarMatricula,
    enviar,
  }
}
