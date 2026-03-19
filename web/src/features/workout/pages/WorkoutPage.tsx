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
import type { StudentSession } from '../../../types/auth'
import { ExerciseCard } from '../components/ExerciseCard'
import { WeekDayTabs } from '../components/WeekDayTabs'
import { fetchWorkoutDays } from '../services/workout-api'
import type { WorkoutDraftByDay, WorkoutSavedStateByDay } from '../types/workout'

type WorkoutPageProps = {
  session: StudentSession
}

const dayIdByWeekDay = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

function getInitialSelectedDayId() {
  return dayIdByWeekDay[new Date().getDay()]
}

function resolveSelectedDayId(days: WorkoutPageDay[], currentSelectedDayId: string) {
  const currentDay = days.find((day) => day.id === currentSelectedDayId)

  if (currentDay?.active) {
    return currentDay.id
  }

  const todayDayId = getInitialSelectedDayId()
  const todayIndex = days.findIndex((day) => day.id === todayDayId)

  if (todayIndex >= 0 && days[todayIndex]?.active) {
    return days[todayIndex].id
  }

  if (todayIndex >= 0) {
    const nextActiveDay = days
      .slice(todayIndex + 1)
      .find((day) => day.active)

    if (nextActiveDay) {
      return nextActiveDay.id
    }
  }

  return days.find((day) => day.active)?.id ?? days[0]?.id ?? currentSelectedDayId
}

type WorkoutPageDay = {
  id: string
  label: string
  active: boolean
  title: string
  exercises: {
    id: string
    name: string
    notes?: string
    sets: {
      id: string
      label: string
      reps: string
    }[]
  }[]
}

export function WorkoutPage({ session }: WorkoutPageProps) {
  const [selectedDayId, setSelectedDayId] = useState(getInitialSelectedDayId)
  const [workoutDays, setWorkoutDays] = useState<WorkoutPageDay[]>([])
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  )
  const [draftByDay, setDraftByDay] = useState<WorkoutDraftByDay>(
    () => getWorkoutDraftByDay(session.enrollmentCode) ?? {},
  )
  const [savedStateByDay, setSavedStateByDay] = useState<WorkoutSavedStateByDay>(
    () => getWorkoutSavedStateByDay(session.enrollmentCode) ?? {},
  )
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedDay =
    workoutDays.find((day) => day.id === selectedDayId) ?? workoutDays[0]
  const selectedExercises = selectedDay?.exercises ?? []
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
    selectedExercises.length > 0 &&
    selectedExercises.every((exercise) => {
      const hasAllSetsCompleted = exercise.sets.every((set) =>
        completedSetIds.has(set.id),
      )

      return hasAllSetsCompleted || completedExerciseIds.has(exercise.id)
    })
  const hasPendingChanges =
    JSON.stringify(selectedDraft) !== JSON.stringify(selectedSavedState)

  function handleLogout() {
    clearStudentSession()
    clearWorkoutProgressStorage(session.enrollmentCode)
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
    if (!selectedDay) {
      return
    }

    const exercise = selectedDay.exercises.find(
      (exerciseItem) => exerciseItem.id === exerciseId,
    )

    if (!exercise) {
      return
    }

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

      if (!canToggle) {
        return draft
      }

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
    if (!selectedDay) {
      return
    }

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
    setSavedStateByDay((currentSavedStateByDay) => {
      const nextSavedStateByDay = {
        ...currentSavedStateByDay,
        [selectedDayId]: {
          completedSetIds: [...selectedDraft.completedSetIds],
          completedExerciseIds: [...selectedDraft.completedExerciseIds],
        },
      }

      persistWorkoutSavedStateByDay(
        session.enrollmentCode,
        nextSavedStateByDay,
      )
      return nextSavedStateByDay
    })
    setSavedAt(new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }))
  }

  useEffect(() => {
    let cancelled = false

    async function loadWorkoutDays() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const days = await fetchWorkoutDays(session.enrollmentCode)

        if (cancelled) {
          return
        }

        setWorkoutDays(days)
        setSelectedDayId((currentSelectedDayId) =>
          resolveSelectedDayId(days, currentSelectedDayId),
        )
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Nao foi possivel carregar os treinos.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadWorkoutDays()

    return () => {
      cancelled = true
    }
  }, [session.enrollmentCode])

  useEffect(() => {
    persistWorkoutDraftByDay(session.enrollmentCode, draftByDay)
  }, [draftByDay, session.enrollmentCode])

  useEffect(() => {
    persistWorkoutSavedStateByDay(session.enrollmentCode, savedStateByDay)
  }, [savedStateByDay, session.enrollmentCode])

  return (
    <MobilePage
      title={session.studentName}
      subtitle={session.studentGoal}
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

        {isLoading ? (
          <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
            Carregando treino...
          </p>
        ) : errorMessage ? (
          <p className="rounded-[var(--radius-card)] bg-[color:rgba(185,74,72,0.12)] px-4 py-4 text-sm text-[var(--color-danger)]">
            {errorMessage}
          </p>
        ) : selectedDay ? (
          <>
            <WeekDayTabs
              days={workoutDays}
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
          </>
        ) : (
          <p className="rounded-[var(--radius-card)] bg-white px-4 py-4 text-sm text-[var(--color-text-base)]">
            Nenhum treino encontrado para este aluno.
          </p>
        )}

        {savedAt && (
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Progresso salvo as {savedAt}.
          </p>
        )}

        {selectedDay && hasPendingChanges && (
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
