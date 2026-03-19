import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AlunosService } from './alunos.service';

describe('AlunosService', () => {
  let service: AlunosService;
  let prisma: {
    aluno: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      aluno: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunosService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AlunosService>(AlunosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('busca aluno por matricula', async () => {
    prisma.aluno.findUnique.mockResolvedValue({
      id: 1,
      matricula: '1001',
      nome: 'Lucas Andrade',
    });

    const result = await service.buscarAlunoPorMatricula('1001');

    expect(prisma.aluno.findUnique).toHaveBeenCalledWith({
      where: { matricula: '1001' },
    });
    expect(result).toMatchObject({
      id: 1,
      matricula: '1001',
    });
  });

  it('falha ao buscar aluno inexistente por id', async () => {
    prisma.aluno.findUnique.mockResolvedValue(null);

    await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
  });

  it('atualiza aluno existente', async () => {
    prisma.aluno.findUnique.mockResolvedValue({
      id: 1,
      nome: 'Lucas Andrade',
    });
    prisma.aluno.update.mockResolvedValue({
      id: 1,
      nome: 'Lucas Atualizado',
    });

    const result = await service.atualizar(1, {
      nome: 'Lucas Atualizado',
    });

    expect(prisma.aluno.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Lucas Atualizado' },
    });
    expect(result).toMatchObject({
      id: 1,
      nome: 'Lucas Atualizado',
    });
  });
});
