import type { WorkoutDay } from '../types/workout'

type WeekDayTabsProps = {
  days: WorkoutDay[]
  selectedDayId: string
  onSelectDay: (dayId: string) => void
}

export function WeekDayTabs({
  days,
  selectedDayId,
  onSelectDay,
}: WeekDayTabsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {days.map((day) => {
        const isSelected = day.id === selectedDayId

        return (
          <button
            key={day.id}
            type="button"
            disabled={!day.active}
            onClick={() => onSelectDay(day.id)}
            className={[
              'h-11 rounded-[var(--radius-card)] border text-sm font-semibold transition',
              isSelected
                ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] text-white shadow-[var(--shadow-card)]'
                : 'border-[var(--color-border-soft)] bg-white text-[var(--color-text-strong)] shadow-[0_8px_18px_-16px_rgba(24,49,42,0.35)]',
              !day.active
                ? 'cursor-not-allowed border-dashed border-[var(--color-border-soft)] bg-transparent text-[var(--color-text-muted)] opacity-60 shadow-none'
                : '',
            ].join(' ')}
          >
            {day.label}
          </button>
        )
      })}
    </div>
  )
}
