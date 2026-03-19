import { MobilePage } from '../../../components/ui/MobilePage'
import { clearStudentSession } from '../../../services/storage/session-storage'
import type { StudentSession } from '../../../types/auth'

type WorkoutPageProps = {
  session: StudentSession
}

const weekDays = [
  { label: 'Seg', active: true },
  { label: 'Ter', active: true },
  { label: 'Qua', active: true },
  { label: 'Qui', active: false },
  { label: 'Sex', active: true },
  { label: 'Sab', active: false },
  { label: 'Dom', active: false },
]

export function WorkoutPage({ session }: WorkoutPageProps) {
  function handleLogout() {
    clearStudentSession()
    window.location.reload()
  }

  return (
    <MobilePage title={session.studentName} subtitle={session.studentGoal}>
      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm leading-6 text-[var(--color-text-base)]">
            Seu treino atual ficara disponivel aqui apos a integracao com a
            API.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-border-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {weekDays.map((day) => (
            <button
              key={day.label}
              type="button"
              disabled={!day.active}
              className="h-11 rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white text-sm font-semibold text-[var(--color-text-strong)] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[var(--color-canvas)] disabled:text-[var(--color-text-muted)]"
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Proximo passo
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-base)]">
            Conectar treinos reais da API e montar a lista expansivel de
            exercicios.
          </p>
        </div>
      </div>
    </MobilePage>
  )
}
