import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { caminhoTreinosDoAluno, paths } from '@/shared/lib/paths'
import type { Aluno, NovoAluno } from './alunos.dto'
import { cadastrarAluno, listarAlunos } from './alunos.service'

export type CamposAluno = {
  nome: string
  email: string
  matricula: string
  telefone: string
}

export type ErrosAluno = Partial<Record<keyof CamposAluno, string>>

export function proximaMatricula(alunos: Aluno[]) {
  const numericas = alunos
    .map((aluno) => aluno.matricula)
    .filter((matricula) => /^\d+$/.test(matricula))

  if (numericas.length === 0) {
    return '1'
  }

  const maior = numericas.reduce((a, b) => (Number(b) > Number(a) ? b : a))

  return String(Number(maior) + 1).padStart(maior.length, '0')
}

export function validarCamposAluno(campos: CamposAluno): ErrosAluno {
  const erros: ErrosAluno = {}

  if (!campos.nome.trim()) {
    erros.nome = 'Informe o nome do aluno.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.trim())) {
    erros.email = 'Informe um e-mail valido.'
  }

  if (!/^\d+$/.test(campos.matricula.trim())) {
    erros.matricula = 'A matricula deve ter apenas numeros.'
  }

  return erros
}

function montarNovoAluno(campos: CamposAluno): NovoAluno {
  const telefone = campos.telefone.trim()

  return {
    nome: campos.nome.trim(),
    email: campos.email.trim(),
    matricula: campos.matricula.trim(),
    ...(telefone ? { telefone } : {}),
  }
}

export function useAlunoCadastro() {
  const navigate = useNavigate()
  const [campos, setCampos] = useState<CamposAluno>({
    nome: '',
    email: '',
    matricula: '',
    telefone: '',
  })
  const [matriculaAlterada, setMatriculaAlterada] = useState(false)
  const [erros, setErros] = useState<ErrosAluno>({})
  const [mensagemErro, setMensagemErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function sugerirMatricula() {
      try {
        const alunos = await listarAlunos()

        if (!cancelado) {
          setCampos((atuais) =>
            atuais.matricula
              ? atuais
              : { ...atuais, matricula: proximaMatricula(alunos) },
          )
        }
      } catch {
        // Sem a sugestao o professor digita a matricula manualmente.
      }
    }

    sugerirMatricula()

    return () => {
      cancelado = true
    }
  }, [])

  function alterarCampo(campo: keyof CamposAluno, valor: string) {
    let valorFinal = valor

    if (campo === 'matricula') {
      setMatriculaAlterada(true)
      valorFinal = valor.replace(/\D/g, '')
    }

    setCampos((atuais) => ({ ...atuais, [campo]: valorFinal }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
    setMensagemErro('')
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const errosDeValidacao = validarCamposAluno(campos)
    setErros(errosDeValidacao)

    if (Object.keys(errosDeValidacao).length > 0) {
      return
    }

    setEnviando(true)

    try {
      const aluno = await cadastrarAluno(montarNovoAluno(campos))
      navigate(caminhoTreinosDoAluno(aluno.id), { replace: true })
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : 'Nao foi possivel cadastrar o aluno.'

      if (mensagem.toLowerCase().includes('matricula')) {
        setErros({ matricula: mensagem })
      } else if (mensagem.toLowerCase().includes('e-mail')) {
        setErros({ email: mensagem })
      } else {
        setMensagemErro(mensagem)
      }

      setEnviando(false)
    }
  }

  return {
    campos,
    erros,
    mensagemErro,
    enviando,
    matriculaSugerida: !matriculaAlterada && campos.matricula !== '',
    alterarCampo,
    enviar,
    voltar: () => navigate(paths.professor.alunos),
  }
}
