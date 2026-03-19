import { Injectable } from '@nestjs/common';
import { AlunosService } from '../alunos/alunos.service';
import { TreinosService } from '../treinos/treinos.service';

@Injectable()
export class AlunoPortalService {
  constructor(
    private readonly alunosService: AlunosService,
    private readonly treinosService: TreinosService,
  ) {}

  async login(matricula: string) {
    const aluno = await this.alunosService.buscarAlunoPorMatricula(matricula);
    const treinos = await this.treinosService.listar({ alunoId: aluno.id });

    return {
      enrollmentCode: aluno.matricula,
      studentName: aluno.nome,
      studentGoal: treinos[0]?.objetivo ?? 'Treino personalizado',
    };
  }

  async listWorkoutDays(matricula: string) {
    const aluno = await this.alunosService.buscarAlunoPorMatricula(matricula);
    const treinos = await this.treinosService.listar({ alunoId: aluno.id });

    const orderedWeekDays = [
      { id: 'seg', label: 'Seg' },
      { id: 'ter', label: 'Ter' },
      { id: 'qua', label: 'Qua' },
      { id: 'qui', label: 'Qui' },
      { id: 'sex', label: 'Sex' },
      { id: 'sab', label: 'Sab' },
      { id: 'dom', label: 'Dom' },
    ];

    const treinoPorDia = new Map<string, any>(
      treinos.map((treino) => [treino.diaSemana, treino]),
    );

    return orderedWeekDays.map((weekDay) => {
      const treino = treinoPorDia.get(weekDay.id);

      return {
        id: weekDay.id,
        label: weekDay.label,
        active: Boolean(treino),
        title: treino?.nome ?? 'Sem treino',
        exercises:
          treino?.exercicios.map((item) => ({
            id: `${treino.id}-${item.exercicioId}`,
            name: item.exercicio.nome,
            notes: item.observacao ?? undefined,
            sets: Array.from({ length: item.series }, (_, index) => ({
              id: `${treino.id}-${item.exercicioId}-serie-${index + 1}`,
              label: `Serie ${index + 1}`,
              reps: `${item.repeticoes} reps`,
            })),
          })) ?? [],
      };
    });
  }
}
