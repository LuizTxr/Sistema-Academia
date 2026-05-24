import type { FormEvent } from 'react'
import { useState } from 'react'
import { MobilePage } from '../../../components/ui/MobilePage'
import { persistStudentSession } from '../../../services/storage/session-storage'
import { loginStudent } from '../services/auth-api'

export function LoginPage() {
  const [enrollmentCode, setEnrollmentCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleEnrollmentChange(value: string) {
    setEnrollmentCode(value.replace(/\D/g, ''))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = enrollmentCode.trim()

    if (!normalizedCode) {
      setErrorMessage('Informe sua matricula para entrar.')
      return
    }

    setIsSubmitting(true)

    try {
      const student = await loginStudent(normalizedCode)
      persistStudentSession(student)
      window.location.reload()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MobilePage>
      <div className="relative flex min-h-[calc(100svh-7rem)] flex-col justify-center gap-8">
        <p className="absolute top-0 left-0 right-0 text-center text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Sistema Academia
        </p>

        <header className="grid gap-2 text-center">
          <p className="sr-only">
            Sistema Academia
          </p>
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-strong)]">
            Login
          </h1>
          <p className="mx-auto text-sm leading-5 text-[var(--color-text-base)]">
            Entre com sua matricula.
          </p>
        </header>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2" htmlFor="enrollmentCode">
            <input
              id="enrollmentCode"
              name="enrollmentCode"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              disabled={isSubmitting}
              value={enrollmentCode}
              onChange={(event) => handleEnrollmentChange(event.target.value)}
              placeholder="000000"
              className="h-12 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white px-4 text-center text-base text-[var(--color-text-strong)] outline-none transition focus:border-[var(--color-accent-strong)] focus:ring-2 focus:ring-[var(--color-accent-soft)]"
            />
          </label>

          {errorMessage && (
            <p className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-accent-strong)] px-4 text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </MobilePage>
  )
}
