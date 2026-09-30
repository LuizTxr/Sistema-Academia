import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  private tratarErroDeUnicidade(erro: unknown): never {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === 'P2002'
    ) {
      const detalhe = JSON.stringify(erro.meta ?? {});

      if (detalhe.includes('matricula')) {
        throw new ConflictException('Matricula ja cadastrada');
      }

      if (detalhe.includes('email')) {
        throw new ConflictException('E-mail ja cadastrado');
      }

      throw new ConflictException('Aluno ja cadastrado');
    }

    throw erro;
  }

  async criar(data: CreateAlunoDto) {
    try {
      return await this.prisma.aluno.create({
        data,
      });
    } catch (erro) {
      return this.tratarErroDeUnicidade(erro);
    }
  }

  listar() {
    return this.prisma.aluno.findMany();
  }

  async buscarPorId(id: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno;
  }

  async buscarAlunoPorMatricula(matricula: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { matricula },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return aluno;
  }

  async atualizar(id: number, data: UpdateAlunoDto) {
    await this.buscarPorId(id);

    try {
      return await this.prisma.aluno.update({
        where: { id },
        data,
      });
    } catch (erro) {
      return this.tratarErroDeUnicidade(erro);
    }
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.aluno.delete({
      where: { id },
    });
  }
}
