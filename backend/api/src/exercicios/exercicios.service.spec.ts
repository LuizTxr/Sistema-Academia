import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ExerciciosService } from './exercicios.service';

describe('ExerciciosService', () => {
  let service: ExerciciosService;
  let prisma: {
    exercicio: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      exercicio: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciciosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ExerciciosService>(ExerciciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('busca exercicio por id', async () => {
    prisma.exercicio.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Supino reto',
    });

    const result = await service.findById(1);

    expect(prisma.exercicio.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toMatchObject({
      id: 1,
      nome: 'Supino reto',
    });
  });

  it('falha ao buscar exercicio inexistente', async () => {
    prisma.exercicio.findUnique.mockResolvedValue(null);

    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('atualiza exercicio existente', async () => {
    prisma.exercicio.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Supino reto',
    });
    prisma.exercicio.update.mockResolvedValue({
      id: 1,
      nome: 'Supino inclinado',
    });

    const result = await service.update(1, { nome: 'Supino inclinado' });

    expect(prisma.exercicio.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Supino inclinado' },
    });
    expect(result).toMatchObject({
      id: 1,
      nome: 'Supino inclinado',
    });
  });
});
