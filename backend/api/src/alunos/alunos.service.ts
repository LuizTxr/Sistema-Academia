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