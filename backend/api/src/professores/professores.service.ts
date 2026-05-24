import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessoresService {
  constructor(private readonly prisma: PrismaService) {}

  criar(data: CreateProfessorDto) {
    return this.prisma.professor.create({
      data,
    });
  }

  listar() {
    return this.prisma.professor.findMany();
  }

  async buscarPorId(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
    });

    if (!professor) {
      throw new NotFoundException('Professor nao encontrado');
    }

    return professor;
  }

  async atualizar(id: number, data: UpdateProfessorDto) {
    await this.buscarPorId(id);

    return this.prisma.professor.update({
      where: { id },
      data,
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.professor.delete({
      where: { id },
    });
  }
}
