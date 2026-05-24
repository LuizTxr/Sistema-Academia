import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EquipamentosService } from './equipamentos.service';

describe('EquipamentosService', () => {
  let service: EquipamentosService;
  let prisma: {
    equipamento: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      equipamento: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipamentosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('busca equipamento por id', async () => {
    prisma.equipamento.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Banco de supino',
    });

    const result = await service.buscarPorId(1);

    expect(prisma.equipamento.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toMatchObject({
      id: 1,
      nome: 'Banco de supino',
    });
  });

  it('falha ao buscar equipamento inexistente', async () => {
    prisma.equipamento.findUnique.mockResolvedValue(null);

    await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
  });

  it('atualiza equipamento existente', async () => {
    prisma.equipamento.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Banco de supino',
    });
    prisma.equipamento.update.mockResolvedValue({
      id: 1,
      nome: 'Banco ajustavel',
    });

    const result = await service.atualizar(1, { nome: 'Banco ajustavel' });

    expect(prisma.equipamento.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Banco ajustavel' },
    });
    expect(result).toMatchObject({
      id: 1,
      nome: 'Banco ajustavel',
    });
  });
});
