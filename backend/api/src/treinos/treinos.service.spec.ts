import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TreinosService } from './treinos.service';

describe('TreinosService', () => {
  let service: TreinosService;
  let prisma: {
    treino: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    aluno: {
      findUnique: jest.Mock;
    };
    professor: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      treino: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      aluno: {
        findUnique: jest.fn(),
      },
      professor: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TreinosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<TreinosService>(TreinosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('allows aluno to list only own treinos', async () => {
    prisma.treino.findMany.mockResolvedValue([{ id: 10, alunoId: 2 }]);

    const result = await service.listarParaUsuario(
      { id: 2, role: 'aluno' },
      { alunoId: 2 },
    );

    expect(prisma.treino.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ alunoId: 2 }),
      }),
    );
    expect(result).toEqual([{ id: 10, alunoId: 2 }]);
  });

  it('blocks aluno from listing another aluno treinos', async () => {
    expect(() =>
      service.listarParaUsuario({ id: 2, role: 'aluno' }, { alunoId: 3 }),
    ).toThrow(ForbiddenException);
  });

  it('blocks professor from creating treino for another professor', async () => {
    await expect(
      service.criarParaProfessor(
        { id: 1, role: 'professor' },
        {
          nome: 'Treino X',
          diaSemana: 'seg',
          alunoId: 2,
          professorId: 99,
          objetivo: 'Hipertrofia',
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('blocks professor from editing treino that is not theirs', async () => {
    prisma.treino.findUnique.mockResolvedValue({
      id: 5,
      alunoId: 2,
      professorId: 7,
      nome: 'Treino A',
      diaSemana: 'seg',
      objetivo: 'Hipertrofia',
      aluno: null,
      professor: null,
      exercicios: [],
    });

    await expect(
      service.atualizarParaProfessor(
        { id: 1, role: 'professor' },
        5,
        { nome: 'Novo nome' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
