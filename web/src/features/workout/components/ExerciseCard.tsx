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
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-strong)]">
            {exercise.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {completed
              ? 'Exercicio concluido'
              : `${completedSetIds.length}/${exercise.sets.length} series concluidas`}
          </p>
        </div>
        <span className="text-lg text-[var(--color-text-muted)]">
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

          {!completed && (
            <button
              type="button"
              onClick={onCompleteExercise}
              className="mb-4 flex h-11 items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-accent-strong)] px-4 text-sm font-semibold text-[var(--color-accent-strong)]"
            >
              Concluir exercicio
            </button>
          )}

          <div className="grid gap-2">
            {exercise.sets.map((set) => (
              <button
                key={set.id}
                type="button"
                onClick={() => onToggleSet(set.id)}
                className={[
                  'flex items-center justify-between rounded-[calc(var(--radius-card)-0.25rem)] px-3 py-3 text-left transition',
                  completedSetIds.includes(set.id)
                    ? 'bg-[var(--color-accent-soft)]'
                    : 'bg-[var(--color-canvas)]',
                ].join(' ')}
              >
                <span className="text-sm font-medium text-[var(--color-text-strong)]">
                  {set.label}
                </span>
                <span className="text-sm text-[var(--color-text-base)]">
                  {completedSetIds.includes(set.id) ? 'Concluida' : set.reps}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
