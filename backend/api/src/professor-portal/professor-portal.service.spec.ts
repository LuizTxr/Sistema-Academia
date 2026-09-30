import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { gerarHashSenha } from '../auth/senha';
import { PrismaService } from '../prisma/prisma.service';
import { ProfessorPortalService } from './professor-portal.service';

describe('ProfessorPortalService', () => {
  let service: ProfessorPortalService;
  let prisma: { professor: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { professor: { findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorPortalService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProfessorPortalService);
  });

  it('retorna os dados publicos do professor quando as credenciais conferem', async () => {
    prisma.professor.findUnique.mockResolvedValue({
      id: 3,
      nome: 'Joao Silva',
      email: 'joao@academia.com',
      especialidade: 'Musculacao',
      credencial: { senhaHash: gerarHashSenha('segredo123') },
    });

    await expect(
      service.login('joao@academia.com', 'segredo123'),
    ).resolves.toEqual({
      id: 3,
      nome: 'Joao Silva',
      email: 'joao@academia.com',
    });
  });

  it('rejeita senha incorreta', async () => {
    prisma.professor.findUnique.mockResolvedValue({
      id: 3,
      nome: 'Joao Silva',
      email: 'joao@academia.com',
      credencial: { senhaHash: gerarHashSenha('segredo123') },
    });

    await expect(
      service.login('joao@academia.com', 'errada'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita e-mail inexistente com a mesma mensagem', async () => {
    prisma.professor.findUnique.mockResolvedValue(null);

    await expect(
      service.login('ninguem@academia.com', 'qualquer'),
    ).rejects.toThrow('E-mail ou senha invalidos');
  });

  it('rejeita professor sem credencial cadastrada', async () => {
    prisma.professor.findUnique.mockResolvedValue({
      id: 4,
      nome: 'Sem Senha',
      email: 'semsenha@academia.com',
      credencial: null,
    });

    await expect(
      service.login('semsenha@academia.com', 'qualquer'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
