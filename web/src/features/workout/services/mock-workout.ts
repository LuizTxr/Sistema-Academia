import type { WorkoutDay } from '../types/workout'

export const mockWorkoutDays: WorkoutDay[] = [
  {
    id: 'seg',
    label: 'Seg',
    active: true,
    title: 'Treino A',
    exercises: [
      {
        id: 'supino-reto',
        name: 'Supino reto',
        notes: 'Movimento controlado e descanso de 60 segundos.',
        sets: [
          { id: 'supino-1', label: 'Serie 1', reps: '12 reps' },
          { id: 'supino-2', label: 'Serie 2', reps: '10 reps' },
          { id: 'supino-3', label: 'Serie 3', reps: '8 reps' },
        ],
      },
      {
        id: 'crucifixo-maquina',
        name: 'Crucifixo maquina',
        sets: [
          { id: 'crucifixo-1', label: 'Serie 1', reps: '15 reps' },
          { id: 'crucifixo-2', label: 'Serie 2', reps: '12 reps' },
          { id: 'crucifixo-3', label: 'Serie 3', reps: '12 reps' },
        ],
      },
    ],
  },
  {
    id: 'ter',
    label: 'Ter',
    active: true,
    title: 'Treino B',
    exercises: [
      {
        id: 'agachamento-livre',
        name: 'Agachamento livre',
        notes: 'Priorizar amplitude e controle de tronco.',
        sets: [
          { id: 'agachamento-1', label: 'Serie 1', reps: '12 reps' },
          { id: 'agachamento-2', label: 'Serie 2', reps: '10 reps' },
          { id: 'agachamento-3', label: 'Serie 3', reps: '8 reps' },
        ],
      },
      {
        id: 'leg-press',
        name: 'Leg press',
        sets: [
          { id: 'legpress-1', label: 'Serie 1', reps: '15 reps' },
          { id: 'legpress-2', label: 'Serie 2', reps: '12 reps' },
          { id: 'legpress-3', label: 'Serie 3', reps: '10 reps' },
        ],
      },
    ],
  },
  {
    id: 'qua',
    label: 'Qua',
    active: true,
    title: 'Treino C',
    exercises: [
      {
        id: 'puxada-frontal',
        name: 'Puxada frontal',
        sets: [
          { id: 'puxada-1', label: 'Serie 1', reps: '12 reps' },
          { id: 'puxada-2', label: 'Serie 2', reps: '10 reps' },
          { id: 'puxada-3', label: 'Serie 3', reps: '8 reps' },
        ],
      },
    ],
  },
  {
    id: 'qui',
    label: 'Qui',
    active: false,
    title: 'Sem treino',
    exercises: [],
  },
  {
    id: 'sex',
    label: 'Sex',
    active: true,
    title: 'Treino D',
    exercises: [
      {
        id: 'desenvolvimento',
        name: 'Desenvolvimento com halteres',
        sets: [
          { id: 'desenvolvimento-1', label: 'Serie 1', reps: '12 reps' },
          { id: 'desenvolvimento-2', label: 'Serie 2', reps: '10 reps' },
          { id: 'desenvolvimento-3', label: 'Serie 3', reps: '8 reps' },
        ],
      },
    ],
  },
  {
    id: 'sab',
    label: 'Sab',
    active: false,
    title: 'Sem treino',
    exercises: [],
  },
  {
    id: 'dom',
    label: 'Dom',
    active: false,
    title: 'Sem treino',
    exercises: [],
  },
]
