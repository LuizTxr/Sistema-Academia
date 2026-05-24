import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlunosService {

  constructor(private prisma: PrismaService) {}

  async criarAluno(data: any) {
    return this.prisma.aluno.create({
      data,
    });
  }

  async listarAlunos() {
  return this.prisma.aluno.findMany();
}

async buscarAlunoPorId(id: number) {
  const aluno = await this.prisma.aluno.findUnique({
    where: { id }
  });

  if (!aluno) {
    throw new NotFoundException('Aluno não encontrado');
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
    throw new NotFoundException('Aluno não encontrado');
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
    throw new NotFoundException('Treino não encontrado');
  }

  return this.prisma.progressoTreino.upsert({
    where: { alunoId_treinoId: { alunoId, treinoId: treino.id } },
    update: { seriesConcluidas, exerciciosConcluidos },
    create: { alunoId, treinoId: treino.id, seriesConcluidas, exerciciosConcluidos },
  });
}


async atualizarAluno(id: number, data: any) {

  const aluno = await this.prisma.aluno.findUnique({
    where: { id }
  });

  if (!aluno) {
    throw new NotFoundException('Aluno não encontrado');
  }

  return this.prisma.aluno.update({
    where: { id },
    data
  });

}


async removerAluno(id: number) {

  const aluno = await this.prisma.aluno.findUnique({
    where: { id }
  });

  if (!aluno) {
    throw new NotFoundException('Aluno não encontrado');
  }

  return this.prisma.aluno.delete({
    where: { id }
  });

}

}