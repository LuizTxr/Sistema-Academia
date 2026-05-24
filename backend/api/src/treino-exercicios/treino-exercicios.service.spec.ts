import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TreinoExerciciosService } from './treino-exercicios.service';

describe('TreinoExerciciosService', () => {
  let service: TreinoExerciciosService;
  let prisma: {
    treinoExercicio: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    treino: {
      findUnique: jest.Mock;
    };
    exercicio: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      treinoExercicio: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      treino: {
        findUnique: jest.fn(),
      },
      exercicio: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TreinoExerciciosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<TreinoExerciciosService>(TreinoExerciciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('blocks professor from creating item on another professor treino', async () => {
    prisma.treino.findUnique.mockResolvedValue({
      id: 3,
      professorId: 9,
    });

    await expect(
      service.criarParaProfessor(
        { id: 1, role: 'professor' },
        {
          treinoId: 3,
          exercicioId: 2,
          series: 3,
          repeticoes: 10,
          ordem: 1,
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('fails when treino does not exist while creating item', async () => {
    prisma.treino.findUnique.mockResolvedValue(null);

    await expect(
      service.criarParaProfessor(
        { id: 1, role: 'professor' },
        {
          treinoId: 99,
          exercicioId: 2,
          series: 3,
          repeticoes: 10,
        },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('blocks professor from editing item of another professor treino', async () => {
    prisma.treinoExercicio.findUnique.mockResolvedValue({
      id: 4,
      treinoId: 7,
      exercicioId: 2,
      treino: {
        id: 7,
        professorId: 5,
      },
      exercicio: {
        id: 2,
      },
    });

    await expect(
      service.atualizarParaProfessor(
        { id: 1, role: 'professor' },
        4,
        { ordem: 2 },
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
