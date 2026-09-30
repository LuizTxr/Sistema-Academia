import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '@/shared/lib/paths'
import { useSessao } from '@/shared/sessao/sessao.hook'
import { entrarProfessor } from './auth.service'

export function useLoginProfessor() {
  const { entrar } = useSessao()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function alterarEmail(valor: string) {
    setEmail(valor)
    setMensagemErro('')
  }

  function alterarSenha(valor: string) {
    setSenha(valor)
    setMensagemErro('')
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const emailNormalizado = email.trim()

    if (!emailNormalizado || !senha) {
      setMensagemErro('Informe seu e-mail e sua senha para entrar.')
      return
    }

    setEnviando(true)

    try {
      const sessao = await entrarProfessor(emailNormalizado, senha)
      entrar(sessao)
      navigate(paths.professor.alunos, { replace: true })
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Nao foi possivel entrar.',
      )
      setEnviando(false)
    }
  }

  return {
    email,
    senha,
    mensagemErro,
    enviando,
    alterarEmail,
    alterarSenha,
    enviar,
  }
}
