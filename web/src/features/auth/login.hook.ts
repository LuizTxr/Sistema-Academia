import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '../../app/router/paths'
import { useAuth } from './auth.hook'
import { loginStudent } from './auth.service'

export function useLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [enrollmentCode, setEnrollmentCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function changeEnrollmentCode(value: string) {
    setEnrollmentCode(value.replace(/\D/g, ''))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = enrollmentCode.trim()

    if (!normalizedCode) {
      setErrorMessage('Informe sua matricula para entrar.')
      return
    }

    setIsSubmitting(true)

    try {
      const student = await loginStudent(normalizedCode)
      signIn(student)
      navigate(paths.aluno.treino, { replace: true })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      )
      setIsSubmitting(false)
    }
  }

  return {
    enrollmentCode,
    errorMessage,
    isSubmitting,
    changeEnrollmentCode,
    submit,
  }
}
