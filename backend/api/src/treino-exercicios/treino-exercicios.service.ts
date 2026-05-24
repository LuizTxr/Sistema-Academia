import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreinoExercicioDto } from './dto/create-treino-exercicio.dto';
import { UpdateTreinoExercicioDto } from './dto/update-treino-exercicio.dto';

@Injectable()
export class TreinoExerciciosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    exercicio: true,
    treino: true,
  };

  private async validarTreinoEExercicio(treinoId: number, exercicioId: number) {
    const [treino, exercicio] = await Promise.all([
      this.prisma.treino.findUnique({ where: { id: treinoId } }),
      this.prisma.exercicio.findUnique({ where: { id: exercicioId } }),
    ]);

    if (!treino) {
      throw new NotFoundException('Treino nao encontrado');
    }

    if (!exercicio) {
      throw new NotFoundException('Exercicio nao encontrado');
    }
  }

  async criar(data: CreateTreinoExercicioDto) {
    await this.validarTreinoEExercicio(data.treinoId, data.exercicioId);

    return this.prisma.treinoExercicio.create({
      data,
      include: this.include,
    });
  }

  async criarParaProfessor(
    user: AuthenticatedUser,
    data: CreateTreinoExercicioDto,
  ) {
    const treino = await this.prisma.treino.findUnique({
      where: { id: data.treinoId },
    });

    if (!treino) {
      throw new NotFoundException('Treino nao encontrado');
    }

    if (treino.professorId !== user.id) {
      throw new ForbiddenException(
        'Professor so pode alterar itens de treino proprio',
      );
    }

    return this.criar(data);
  }

  async buscarPorId(id: number) {
    const treinoExercicio = await this.prisma.treinoExercicio.findUnique({
      where: { id },
      include: this.include,
    });

    if (!treinoExercicio) {
      throw new NotFoundException('Item de treino nao encontrado');
    }

    return treinoExercicio;
  }

  async atualizar(id: number, data: UpdateTreinoExercicioDto) {
    const atual = await this.buscarPorId(id);

    if (data.exercicioId !== undefined) {
      await this.validarTreinoEExercicio(atual.treinoId, data.exercicioId);
    }

    return this.prisma.treinoExercicio.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async atualizarParaProfessor(
    user: AuthenticatedUser,
    id: number,
    data: UpdateTreinoExercicioDto,
  ) {
    const atual = await this.buscarPorId(id);

    if (atual.treino.professorId !== user.id) {
      throw new ForbiddenException(
        'Professor so pode alterar itens de treino proprio',
      );
    }

    return this.atualizar(id, data);
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.treinoExercicio.delete({
      where: { id },
    });
  }

  async removerParaProfessor(user: AuthenticatedUser, id: number) {
    const atual = await this.buscarPorId(id);

    if (atual.treino.professorId !== user.id) {
      throw new ForbiddenException(
        'Professor so pode alterar itens de treino proprio',
      );
    }

    return this.remover(id);
  }
}
