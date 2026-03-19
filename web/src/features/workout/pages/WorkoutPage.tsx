import { useState } from 'react'
import { MobilePage } from '../../../components/ui/MobilePage'
import { clearStudentSession } from '../../../services/storage/session-storage'
import type { StudentSession } from '../../../types/auth'
import { ExerciseCard } from '../components/ExerciseCard'
import { WeekDayTabs } from '../components/WeekDayTabs'
import { mockWorkoutDays } from '../services/mock-workout'
import type { WorkoutDraftByDay, WorkoutSavedStateByDay } from '../types/workout'

type WorkoutPageProps = {
  session: StudentSession
}

export function WorkoutPage({ session }: WorkoutPageProps) {
  const [selectedDayId, setSelectedDayId] = useState('seg')
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  )
  const [draftByDay, setDraftByDay] = useState<WorkoutDraftByDay>({})
  const [savedStateByDay, setSavedStateByDay] = useState<WorkoutSavedStateByDay>(
    {},
  )
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const selectedDay =
    mockWorkoutDays.find((day) => day.id === selectedDayId) ?? mockWorkoutDays[0]
  const selectedDraft = draftByDay[selectedDayId] ?? {
    completedSetIds: [],
    completedExerciseIds: [],
  }
  const selectedSavedState = savedStateByDay[selectedDayId] ?? {
    completedSetIds: [],
    completedExerciseIds: [],
  }
  const completedExerciseIds = new Set(selectedDraft.completedExerciseIds)
  const completedSetIds = new Set(selectedDraft.completedSetIds)
  const isWorkoutCompleted =
    selectedDay.exercises.length > 0 &&
    selectedDay.exercises.every((exercise) => {
      const hasAllSetsCompleted = exercise.sets.every((set) =>
        completedSetIds.has(set.id),
      )

      return hasAllSetsCompleted || completedExerciseIds.has(exercise.id)
    })
  const hasPendingChanges =
    JSON.stringify(selectedDraft) !== JSON.stringify(selectedSavedState)

  function handleLogout() {
    clearStudentSession()
    window.location.reload()
  }

  function handleSelectDay(dayId: string) {
    setSelectedDayId(dayId)
    setExpandedExerciseId(null)
    setSavedAt(null)
  }

  function updateDayDraft(
    updater: (draft: {
      completedSetIds: string[]
      completedExerciseIds: string[]
    }) => {
      completedSetIds: string[]
      completedExerciseIds: string[]
    },
  ) {
    setDraftByDay((currentDraftByDay) => {
      const currentDraft = currentDraftByDay[selectedDayId] ?? {
        completedSetIds: [],
        completedExerciseIds: [],
      }

      return {
        ...currentDraftByDay,
        [selectedDayId]: updater(currentDraft),
      }
    })
    setSavedAt(null)
  }

  function handleToggleSet(exerciseId: string, setId: string) {
    const exercise = selectedDay.exercises.find(
      (exerciseItem) => exerciseItem.id === exerciseId,
    )

    if (!exercise) {
      return
    }

    updateDayDraft((draft) => {
      const isCompleted = draft.completedSetIds.includes(setId)
      const nextCompletedSetIds = isCompleted
        ? draft.completedSetIds.filter((completedSetId) => completedSetId !== setId)
        : [...draft.completedSetIds, setId]

      const allSetsCompleted = exercise.sets.every((set) =>
        nextCompletedSetIds.includes(set.id),
      )

      const nextCompletedExerciseIds = allSetsCompleted
        ? Array.from(new Set([...draft.completedExerciseIds, exerciseId]))
        : draft.completedExerciseIds.filter(
            (completedExerciseId) => completedExerciseId !== exerciseId,
          )

      return {
        completedSetIds: nextCompletedSetIds,
        completedExerciseIds: nextCompletedExerciseIds,
      }
    })
  }

  function handleCompleteExercise(exerciseId: string) {
    const exercise = selectedDay.exercises.find(
      (exerciseItem) => exerciseItem.id === exerciseId,
    )

    if (!exercise) {
      return
    }

    updateDayDraft((draft) => ({
      completedSetIds: Array.from(
        new Set([...draft.completedSetIds, ...exercise.sets.map((set) => set.id)]),
      ),
      completedExerciseIds: Array.from(
        new Set([...draft.completedExerciseIds, exerciseId]),
      ),
    }))
  }

  function handleSaveProgress() {
    setSavedStateByDay((currentSavedStateByDay) => ({
      ...currentSavedStateByDay,
      [selectedDayId]: {
        completedSetIds: [...selectedDraft.completedSetIds],
        completedExerciseIds: [...selectedDraft.completedExerciseIds],
      },
    }))
    setSavedAt(new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }))
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
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
                {selectedDay.title}
              </h2>
              {isWorkoutCompleted && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-strong)]">
                  Treino concluido
                </span>
              )}
            </div>
          </header>

          <div className="grid gap-3">
            {selectedDay.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                expanded={expandedExerciseId === exercise.id}
                completed={
                  completedExerciseIds.has(exercise.id) ||
                  exercise.sets.every((set) => completedSetIds.has(set.id))
                }
                completedSetIds={exercise.sets
                  .filter((set) => completedSetIds.has(set.id))
                  .map((set) => set.id)}
                onToggle={() =>
                  setExpandedExerciseId((currentExerciseId) =>
                    currentExerciseId === exercise.id ? null : exercise.id,
                  )
                }
                onToggleSet={(setId) => handleToggleSet(exercise.id, setId)}
                onCompleteExercise={() => handleCompleteExercise(exercise.id)}
              />
            ))}
          </div>
        </section>

        {savedAt && (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Progresso salvo as {savedAt}.
          </p>
        )}

        {hasPendingChanges && (
          <button
            type="button"
            onClick={handleSaveProgress}
            className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-accent-strong)] px-4 text-sm font-semibold text-white transition active:scale-[0.99]"
          >
            Salvar progresso
          </button>
        )}
      </div>
    </MobilePage>
  )
}
