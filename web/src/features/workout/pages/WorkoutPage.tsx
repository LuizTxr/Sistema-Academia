import { useState } from 'react'
import { MobilePage } from '../../../components/ui/MobilePage'
import { clearStudentSession } from '../../../services/storage/session-storage'
import type { StudentSession } from '../../../types/auth'
import { ExerciseCard } from '../components/ExerciseCard'
import { WeekDayTabs } from '../components/WeekDayTabs'
import { mockWorkoutDays } from '../services/mock-workout'

type WorkoutPageProps = {
  session: StudentSession
}

export function WorkoutPage({ session }: WorkoutPageProps) {
  const [selectedDayId, setSelectedDayId] = useState('seg')
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  )

  const selectedDay =
    mockWorkoutDays.find((day) => day.id === selectedDayId) ?? mockWorkoutDays[0]

  function handleLogout() {
    clearStudentSession()
    window.location.reload()
  }

  function handleSelectDay(dayId: string) {
    setSelectedDayId(dayId)
    setExpandedExerciseId(null)
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

        <WeekDayTabs
          days={mockWorkoutDays}
          selectedDayId={selectedDayId}
          onSelectDay={handleSelectDay}
        />

        <section className="grid gap-4">
          <header className="grid gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {selectedDay.label}
            </p>
            <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
              {selectedDay.title}
            </h2>
          </header>

          <div className="grid gap-3">
            {selectedDay.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                expanded={expandedExerciseId === exercise.id}
                onToggle={() =>
                  setExpandedExerciseId((currentExerciseId) =>
                    currentExerciseId === exercise.id ? null : exercise.id,
                  )
                }
              />
            ))}
          </div>
        </section>

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
