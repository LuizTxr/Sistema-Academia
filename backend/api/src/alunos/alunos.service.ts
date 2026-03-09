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

}