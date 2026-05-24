import { useEffect, useState } from 'react'
import { MobilePage } from '../../../components/ui/MobilePage'
import {
  clearStudentSession,
  clearWorkoutProgressStorage,
  getWorkoutDraftByDay,
  getWorkoutSavedStateByDay,
  persistWorkoutDraftByDay,
  persistWorkoutSavedStateByDay,
} from '../../../services/storage/session-storage'
import { apiClient } from '../../../services/api/client'
import type { StudentSession } from '../../../types/auth'
import { ExerciseCard } from '../components/ExerciseCard'
import { WeekDayTabs } from '../components/WeekDayTabs'
import type { WorkoutDay, WorkoutDraftByDay, WorkoutSavedStateByDay } from '../types/workout'

type WorkoutPageProps = {
  session: StudentSession
}

const dayIdByWeekDay = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

function getInitialSelectedDayId(days: WorkoutDay[]) {
  const todayDayId = dayIdByWeekDay[new Date().getDay()]
  const todayIndex = days.findIndex((day) => day.id === todayDayId)

  if (todayIndex >= 0 && days[todayIndex]?.active) {
    return days[todayIndex].id
  }

  if (todayIndex >= 0) {
    const nextActiveDay = days.slice(todayIndex + 1).find((day) => day.active)
    if (nextActiveDay) return nextActiveDay.id
  }

  return days.find((day) => day.active)?.id ?? days[0].id
}

export function WorkoutPage({ session }: WorkoutPageProps) {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDayId, setSelectedDayId] = useState<string>('')
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null)
  const [draftByDay, setDraftByDay] = useState<WorkoutDraftByDay>(
    () => getWorkoutDraftByDay() ?? {},
  )
  const [savedStateByDay, setSavedStateByDay] = useState<WorkoutSavedStateByDay>(
    () => getWorkoutSavedStateByDay() ?? {},
  )
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    apiClient.buscarTreinos(session.id).then(({ dias, progressoInicial }) => {
      setWorkoutDays(dias)
      setSelectedDayId(getInitialSelectedDayId(dias))
      setDraftByDay(progressoInicial)
      setSavedStateByDay(progressoInicial)
      setIsLoading(false)
    })
  }, [session.id])

  const selectedDay = workoutDays.find((day) => day.id === selectedDayId) ?? workoutDays[0]
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
    !!selectedDay &&
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
    clearWorkoutProgressStorage()
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
    const exercise = selectedDay?.exercises.find(
      (exerciseItem) => exerciseItem.id === exerciseId,
    )

    if (!exercise) return

    updateDayDraft((draft) => {
      const exerciseCompletedSetIds = exercise.sets
        .filter((set) => draft.completedSetIds.includes(set.id))
        .map((set) => set.id)
      const targetSetIndex = exercise.sets.findIndex((set) => set.id === setId)
      const lastCompletedIndex = exercise.sets.reduce((highestIndex, set, index) => {
        return exerciseCompletedSetIds.includes(set.id) ? index : highestIndex
      }, -1)
      const isCompleted = draft.completedSetIds.includes(setId)
      const canToggle = isCompleted
        ? targetSetIndex === lastCompletedIndex
        : targetSetIndex === lastCompletedIndex + 1

      if (!canToggle) return draft

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
    const exercise = selectedDay?.exercises.find(
      (exerciseItem) => exerciseItem.id === exerciseId,
    )

    if (!exercise) return

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
    const progresso = {
      completedSetIds: [...selectedDraft.completedSetIds],
      completedExerciseIds: [...selectedDraft.completedExerciseIds],
    }

    setSavedStateByDay((currentSavedStateByDay) => {
      const nextSavedStateByDay = { ...currentSavedStateByDay, [selectedDayId]: progresso }
      persistWorkoutSavedStateByDay(nextSavedStateByDay)
      return nextSavedStateByDay
    })

    apiClient.salvarProgresso(
      session.id,
      selectedDayId,
      progresso.completedSetIds,
      progresso.completedExerciseIds,
    )

    setSavedAt(new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }))
  }

  useEffect(() => {
    persistWorkoutDraftByDay(draftByDay)
  }, [draftByDay])

  useEffect(() => {
    persistWorkoutSavedStateByDay(savedStateByDay)
  }, [savedStateByDay])

  if (isLoading) {
    return (
      <MobilePage title={session.studentName}>
        <p className="text-sm text-[var(--color-text-muted)]">Carregando treinos...</p>
      </MobilePage>
    )
  }

  return (
    <MobilePage
      title={session.studentName}
      headerAction={
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--color-border-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]"
        >
          Sair
        </button>
      }
    >
      <div className="grid gap-5">
        <p className="text-sm leading-5 text-[var(--color-text-base)]">
          Confira seus treinos abaixo.
        </p>

        <WeekDayTabs
          days={workoutDays}
          selectedDayId={selectedDayId}
          onSelectDay={handleSelectDay}
        />

        <section className="grid gap-4">
          <header className="grid gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {selectedDay?.label}
            </p>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">
                {selectedDay?.title}
              </h2>
              {isWorkoutCompleted && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent-strong)]">
                  Treino concluido
                </span>
              )}
            </div>
          </header>

          <div className="grid gap-3">
            {selectedDay?.exercises.map((exercise) => (
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
