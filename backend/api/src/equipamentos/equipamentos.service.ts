import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipamentosService {

  constructor(private prisma: PrismaService) {}

  criar(data: any) {
    return this.prisma.equipamento.create({
      data,
    });
  }

  listar() {
    return this.prisma.equipamento.findMany();
  }

  buscarPorId(id: number) {
    return this.prisma.equipamento.findUnique({
      where: { id },
    });
  }

  atualizar(id: number, data: any) {
    return this.prisma.equipamento.update({
      where: { id },
      data,
    });
  }

  remover(id: number) {
    return this.prisma.equipamento.delete({
      where: { id },
    });
  }
}