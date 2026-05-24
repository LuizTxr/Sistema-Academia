import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@Injectable()
export class EquipamentosService {
  constructor(private readonly prisma: PrismaService) {}

  criar(data: CreateEquipamentoDto) {
    return this.prisma.equipamento.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
      },
    });
  }

  listar() {
    return this.prisma.equipamento.findMany();
  }

  async buscarPorId(id: number) {
    const equipamento = await this.prisma.equipamento.findUnique({
      where: { id },
    });

    if (!equipamento) {
      throw new NotFoundException('Equipamento nao encontrado');
    }

    return equipamento;
  }

  async atualizar(id: number, data: UpdateEquipamentoDto) {
    await this.buscarPorId(id);

    return this.prisma.equipamento.update({
      where: { id },
      data: {
        nome: data.nome,
        tipo: data.tipo,
      },
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);

    return this.prisma.equipamento.delete({
      where: { id },
    });
  }
}
