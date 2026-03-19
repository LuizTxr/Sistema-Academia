import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';

@Injectable()
export class ExerciciosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.exercicio.findMany();
  }

  create(data: CreateExercicioDto) {
    return this.prisma.exercicio.create({
      data: {
        nome: data.nome,
        grupoMuscular: data.grupoMuscular,
        equipamentoId: data.equipamentoId,
      },
    });
  }

  async findById(id: number) {
    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id },
    });

    if (!exercicio) {
      throw new NotFoundException('Exercicio nao encontrado');
    }

    return exercicio;
  }

  async update(id: number, data: UpdateExercicioDto) {
    await this.findById(id);

    return this.prisma.exercicio.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findById(id);

    return this.prisma.exercicio.delete({
      where: { id },
    });
  }
}
