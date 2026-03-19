import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';

@Injectable()
export class TreinosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly treinoInclude = {
    aluno: true,
    professor: true,
    exercicios: {
      include: {
        exercicio: true,
      },
      orderBy: {
        ordem: 'asc' as const,
      },
    },
  };

  private async validarRelacionamentos(alunoId: number, professorId: number) {
    const [aluno, professor] = await Promise.all([
      this.prisma.aluno.findUnique({ where: { id: alunoId } }),
      this.prisma.professor.findUnique({ where: { id: professorId } }),
    ]);

    if (!aluno) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    if (!professor) {
      throw new NotFoundException('Professor nao encontrado');
    }
  }

  async criar(data: CreateTreinoDto) {
    await this.validarRelacionamentos(data.alunoId, data.professorId);

    return this.prisma.treino.create({
      data,
      include: this.treinoInclude,
    });
  }

  listar(filtros?: { alunoId?: number; professorId?: number }) {
    return this.prisma.treino.findMany({
      where: {
        alunoId: filtros?.alunoId,
        professorId: filtros?.professorId,
      },
      include: this.treinoInclude,
      orderBy: [{ diaSemana: 'asc' }, { id: 'asc' }],
    });
  }

  listarParaUsuario(
    user: AuthenticatedUser,
    filtros?: { alunoId?: number; professorId?: number },
  ) {
    if (user.role === 'aluno') {
      if (filtros?.professorId !== undefined) {
        throw new ForbiddenException('Aluno nao pode filtrar por professor');
      }

      if (filtros?.alunoId !== undefined && filtros.alunoId !== user.id) {
        throw new ForbiddenException('Aluno so pode consultar os proprios treinos');
      }

      return this.listar({ alunoId: user.id });
    }

    if (filtros?.professorId !== undefined && filtros.professorId !== user.id) {
      throw new ForbiddenException(
        'Professor so pode consultar treinos vinculados a si mesmo',
      );
    }

    return this.listar({
      ...filtros,
      professorId: user.id,
    });
  }

  async buscarPorId(id: number) {
    const treino = await this.prisma.treino.findUnique({
      where: { id },
      include: this.treinoInclude,
    });

    if (!treino) {
      throw new NotFoundException('Treino nao encontrado');
    }

    return treino;
  }

  async buscarPorIdParaUsuario(user: AuthenticatedUser, id: number) {
    const treino = await this.buscarPorId(id);

    if (user.role === 'aluno' && treino.alunoId !== user.id) {
      throw new ForbiddenException('Aluno so pode consultar os proprios treinos');
    }

    if (user.role === 'professor' && treino.professorId !== user.id) {
      throw new ForbiddenException(
        'Professor so pode consultar treinos vinculados a si mesmo',
      );
    }

    return treino;
  }

  async criarParaProfessor(user: AuthenticatedUser, data: CreateTreinoDto) {
    if (data.professorId !== user.id) {
      throw new ForbiddenException('Professor so pode criar treino proprio');
    }

    return this.criar(data);
  }

  async atualizar(id: number, data: UpdateTreinoDto) {
    await this.buscarPorId(id);

    if (data.alunoId !== undefined && data.professorId !== undefined) {
      await this.validarRelacionamentos(data.alunoId, data.professorId);
    } else if (data.alunoId !== undefined) {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: data.alunoId },
      });

      if (!aluno) {
        throw new NotFoundException('Aluno nao encontrado');
      }
    } else if (data.professorId !== undefined) {
      const professor = await this.prisma.professor.findUnique({
        where: { id: data.professorId },
      });

      if (!professor) {
        throw new NotFoundException('Professor nao encontrado');
      }
    }

    return this.prisma.treino.update({
      where: { id },
      data,
      include: this.treinoInclude,
    });
  }

  async atualizarParaProfessor(
    user: AuthenticatedUser,
    id: number,
    data: UpdateTreinoDto,
  ) {
    const treino = await this.buscarPorId(id);

    if (treino.professorId !== user.id) {
      throw new ForbiddenException('Professor so pode editar treino proprio');
    }

    if (data.professorId !== undefined && data.professorId !== user.id) {
      throw new ForbiddenException('Professor nao pode transferir autoria do treino');
    }

    return this.atualizar(id, data);
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.treino.delete({
      where: { id },
    });
  }

  async removerParaProfessor(user: AuthenticatedUser, id: number) {
    const treino = await this.buscarPorId(id);

    if (treino.professorId !== user.id) {
      throw new ForbiddenException('Professor so pode remover treino proprio');
    }

    return this.remover(id);
  }
}
