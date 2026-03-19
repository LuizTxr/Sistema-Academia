import type { WorkoutExercise } from '../types/workout'

type ExerciseCardProps = {
  exercise: WorkoutExercise
  expanded: boolean
  onToggle: () => void
}

export function ExerciseCard({
  exercise,
  expanded,
  onToggle,
}: ExerciseCardProps) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-white">
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
            {exercise.sets.length} series
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

          <div className="grid gap-2">
            {exercise.sets.map((set) => (
              <div
                key={set.id}
                className="flex items-center justify-between rounded-[calc(var(--radius-card)-0.25rem)] bg-[var(--color-canvas)] px-3 py-3"
              >
                <span className="text-sm font-medium text-[var(--color-text-strong)]">
                  {set.label}
                </span>
                <span className="text-sm text-[var(--color-text-base)]">
                  {set.reps}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
