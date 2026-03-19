import type { WorkoutExercise } from '../types/workout'

type ExerciseCardProps = {
  exercise: WorkoutExercise
  expanded: boolean
  completed: boolean
  completedSetIds: string[]
  onToggle: () => void
  onToggleSet: (setId: string) => void
  onCompleteExercise: () => void
}

export function ExerciseCard({
  exercise,
  expanded,
  completed,
  completedSetIds,
  onToggle,
  onToggleSet,
  onCompleteExercise,
}: ExerciseCardProps) {
  const lastCompletedIndex = exercise.sets.reduce((highestIndex, set, index) => {
    return completedSetIds.includes(set.id) ? index : highestIndex
  }, -1)

  return (
    <article
      className={[
        'rounded-[var(--radius-card)] border bg-white transition',
        completed
          ? 'border-[var(--color-accent-strong)]'
          : 'border-[var(--color-border-soft)]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[var(--color-text-strong)]">
            {exercise.name}
          </h3>
          <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
            {completed
              ? 'Exercicio concluido'
              : `${completedSetIds.length}/${exercise.sets.length} series concluidas`}
          </p>
        </div>
        <span className="shrink-0 text-lg text-[var(--color-text-muted)]">
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--color-border-soft)] px-4 py-4">
          {exercise.notes && (
            <p className="mb-4 text-sm leading-6 text-[var(--color-text-base)]">
              {exercise.notes}
            </p>
          )}

          <div className="grid gap-2">
            {exercise.sets.map((set, index) => {
              const isCompleted = completedSetIds.includes(set.id)
              const isNextAvailable = index === lastCompletedIndex + 1
              const isLastCompleted = index === lastCompletedIndex
              const canToggle = isCompleted ? isLastCompleted : isNextAvailable

              return (
                <button
                  key={set.id}
                  type="button"
                  disabled={!canToggle}
                  onClick={() => onToggleSet(set.id)}
                  className={[
                    'flex flex-col items-start gap-1 rounded-[calc(var(--radius-card)-0.25rem)] border px-3 py-3 text-left transition sm:flex-row sm:items-center sm:justify-between',
                    isCompleted
                      ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-soft)]'
                      : 'border-transparent bg-[var(--color-canvas)]',
                    !canToggle
                      ? 'cursor-not-allowed opacity-50'
                      : 'shadow-[0_8px_18px_-16px_rgba(24,49,42,0.35)]',
                  ].join(' ')}
                >
                  <span className="text-sm font-medium text-[var(--color-text-strong)]">
                    {set.label}
                  </span>
                  <span className="text-sm leading-5 text-[var(--color-text-base)] sm:text-right">
                    {isCompleted
                      ? 'Concluida'
                      : canToggle
                        ? set.reps
                        : `${set.reps} · Aguardando anterior`}
                  </span>
                </button>
              )
            })}
          </div>

          {!completed && (
            <button
              type="button"
              onClick={onCompleteExercise}
              className="mt-4 mx-auto flex h-11 w-full max-w-56 items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-accent-strong)] px-4 text-sm font-semibold text-[var(--color-accent-strong)]"
            >
              Concluir exercicio
            </button>
          )}
        </div>
      )}
    </article>
  )
}
