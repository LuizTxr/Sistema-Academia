import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  criar(data: CreateAlunoDto) {
    return this.prisma.aluno.create({ data });
  }

  listar() {
    return this.prisma.aluno.findMany();
  }

  async buscarPorId(id: number) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id } });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno;
  }

  async buscarAlunoPorMatricula(matricula: string) {
    const aluno = await this.prisma.aluno.findUnique({ where: { matricula } });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno;
  }

  async buscarTreinosDoAluno(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        treinos: {
          orderBy: { diaSemana: 'asc' },
          include: {
            exercicios: {
              orderBy: { ordem: 'asc' },
              include: { exercicio: true },
            },
            progresso: true,
          },
        },
      },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno.treinos;
  }

  async salvarProgresso(
    alunoId: number,
    diaSemana: string,
    seriesConcluidas: string[],
    exerciciosConcluidos: string[],
  ) {
    const treino = await this.prisma.treino.findFirst({
      where: { alunoId, diaSemana },
    });

    if (!treino) {
      throw new NotFoundException('Treino nao encontrado');
    }

    return this.prisma.progressoTreino.upsert({
      where: { alunoId_treinoId: { alunoId, treinoId: treino.id } },
      update: { seriesConcluidas, exerciciosConcluidos },
      create: { alunoId, treinoId: treino.id, seriesConcluidas, exerciciosConcluidos },
    });
  }

  async atualizar(id: number, data: UpdateAlunoDto) {
    await this.buscarPorId(id);
    return this.prisma.aluno.update({ where: { id }, data });
  }

  async remover(id: number) {
    await this.buscarPorId(id);
    return this.prisma.aluno.delete({ where: { id } });
  }
}
