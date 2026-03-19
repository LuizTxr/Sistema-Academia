import { Injectable } from '@nestjs/common';
import { AlunosService } from '../alunos/alunos.service';
import { TreinosService } from '../treinos/treinos.service';

type WorkoutSetView = {
  id: string;
  label: string;
  reps: string;
};

type WorkoutExerciseView = {
  id: string;
  name: string;
  notes?: string;
  sets: WorkoutSetView[];
};

type WorkoutDayView = {
  id: string;
  label: string;
  active: boolean;
  title: string;
  exercises: WorkoutExerciseView[];
};

type StudentSessionView = {
  enrollmentCode: string;
  studentName: string;
  studentGoal: string;
};

@Injectable()
export class AlunoPortalService {
  private readonly orderedWeekDays = [
    { id: 'seg', label: 'Seg' },
    { id: 'ter', label: 'Ter' },
    { id: 'qua', label: 'Qua' },
    { id: 'qui', label: 'Qui' },
    { id: 'sex', label: 'Sex' },
    { id: 'sab', label: 'Sab' },
    { id: 'dom', label: 'Dom' },
  ] as const;

  constructor(
    private readonly alunosService: AlunosService,
    private readonly treinosService: TreinosService,
  ) {}

  async login(matricula: string): Promise<StudentSessionView> {
    const aluno = await this.alunosService.buscarAlunoPorMatricula(matricula);
    const treinos = await this.treinosService.listar({ alunoId: aluno.id });

    return {
      enrollmentCode: aluno.matricula,
      studentName: aluno.nome,
      studentGoal: treinos[0]?.objetivo ?? 'Treino personalizado',
    };
  }

  async listWorkoutDays(matricula: string): Promise<WorkoutDayView[]> {
    const aluno = await this.alunosService.buscarAlunoPorMatricula(matricula);
    const treinos = await this.treinosService.listar({ alunoId: aluno.id });
    const treinoPorDia = new Map(
      treinos.map((treino) => [treino.diaSemana, treino] as const),
    );

    return this.orderedWeekDays.map((weekDay) =>
      this.mapWorkoutDay(weekDay.id, weekDay.label, treinoPorDia.get(weekDay.id)),
    );
  }

  private mapWorkoutDay(
    dayId: string,
    dayLabel: string,
    treino?: Awaited<ReturnType<TreinosService['buscarPorId']>>,
  ): WorkoutDayView {
    return {
      id: dayId,
      label: dayLabel,
      active: Boolean(treino),
      title: treino?.nome ?? 'Sem treino',
      exercises: treino ? this.mapExercises(treino) : [],
    };
  }

  private mapExercises(
    treino: Awaited<ReturnType<TreinosService['buscarPorId']>>,
  ): WorkoutExerciseView[] {
    return treino.exercicios.map((item) => ({
      id: `${treino.id}-${item.exercicioId}`,
      name: item.exercicio.nome,
      notes: item.observacao ?? undefined,
      sets: Array.from({ length: item.series }, (_, index) => ({
        id: `${treino.id}-${item.exercicioId}-serie-${index + 1}`,
        label: `Serie ${index + 1}`,
        reps: `${item.repeticoes} reps`,
      })),
    }));
  }
}
