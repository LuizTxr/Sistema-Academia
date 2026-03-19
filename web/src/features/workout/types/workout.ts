export type WorkoutSet = {
  id: string
  label: string
  reps: string
}

export type WorkoutExercise = {
  id: string
  name: string
  notes?: string
  sets: WorkoutSet[]
}

export type WorkoutDay = {
  id: string
  label: string
  active: boolean
  title: string
  exercises: WorkoutExercise[]
}
