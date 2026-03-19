import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlunoPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async login(matricula: string) {
    const aluno = await (this.prisma.aluno as any).findUnique({
      where: { matricula },
      include: {
        treinos: {
          orderBy: [{ diaSemana: 'asc' }, { id: 'asc' }],
          take: 1,
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException('Matricula nao encontrada');
    }

    return {
      enrollmentCode: aluno.matricula,
      studentName: aluno.nome,
      studentGoal: aluno.treinos[0]?.objetivo ?? 'Treino personalizado',
    };
  }

  async listWorkoutDays(matricula: string) {
    const aluno = await (this.prisma.aluno as any).findUnique({
      where: { matricula },
      include: {
        treinos: {
          include: {
            exercicios: {
              include: {
                exercicio: true,
              },
              orderBy: {
                ordem: 'asc',
              },
            },
          },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

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
      aluno.treinos.map((treino) => [treino.diaSemana, treino]),
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
