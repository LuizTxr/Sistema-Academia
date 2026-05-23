import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginAluno(matricula: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { matricula },
    });

    if (!aluno) {
      throw new UnauthorizedException('Matrícula não encontrada');
    }

    return {
      aluno: {
        id: aluno.id,
        matricula: aluno.matricula,
        nome: aluno.nome,
      },
    };
  }
}
