import { Test, TestingModule } from '@nestjs/testing';
import { AlunosService } from '../alunos/alunos.service';
import { TreinosService } from '../treinos/treinos.service';
import { AlunoPortalService } from './aluno-portal.service';

describe('AlunoPortalService', () => {
  let service: AlunoPortalService;
  let alunosService: {
    buscarAlunoPorMatricula: jest.Mock;
  };
  let treinosService: {
    listar: jest.Mock;
  };

  beforeEach(async () => {
    alunosService = {
      buscarAlunoPorMatricula: jest.fn(),
    };

    treinosService = {
      listar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoPortalService,
        {
          provide: AlunosService,
          useValue: alunosService,
        },
        {
          provide: TreinosService,
          useValue: treinosService,
        },
      ],
    }).compile();

    service = module.get<AlunoPortalService>(AlunoPortalService);
  });

  it('mantem o contrato de login do frontend', async () => {
    alunosService.buscarAlunoPorMatricula.mockResolvedValue({
      id: 1,
      nome: 'Lucas Andrade',
      matricula: '1001',
    });
    treinosService.listar.mockResolvedValue([
      {
        objetivo: 'Hipertrofia',
      },
    ]);

    const result = await service.login('1001');

    expect(result).toEqual({
      enrollmentCode: '1001',
      studentName: 'Lucas Andrade',
      studentGoal: 'Hipertrofia',
    });
  });

  it('retorna objetivo padrao quando o aluno ainda nao tem treino', async () => {
    alunosService.buscarAlunoPorMatricula.mockResolvedValue({
      id: 1,
      nome: 'Lucas Andrade',
      matricula: '1001',
    });
    treinosService.listar.mockResolvedValue([]);

    const result = await service.login('1001');

    expect(result.studentGoal).toBe('Treino personalizado');
  });

  it('monta os dias da semana sem alterar o formato esperado pelo frontend', async () => {
    alunosService.buscarAlunoPorMatricula.mockResolvedValue({
      id: 1,
      nome: 'Lucas Andrade',
      matricula: '1001',
    });
    treinosService.listar.mockResolvedValue([
      {
        id: 10,
        nome: 'Treino A',
        diaSemana: 'seg',
        exercicios: [
          {
            exercicioId: 5,
            series: 2,
            repeticoes: 12,
            observacao: 'Controlar movimento',
            exercicio: {
              nome: 'Supino reto',
            },
          },
        ],
      },
    ]);

    const result = await service.listWorkoutDays('1001');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'seg',
          label: 'Seg',
          active: true,
          title: 'Treino A',
          exercises: [
            {
              id: '10-5',
              name: 'Supino reto',
              notes: 'Controlar movimento',
              sets: [
                {
                  id: '10-5-serie-1',
                  label: 'Serie 1',
                  reps: '12 reps',
                },
                {
                  id: '10-5-serie-2',
                  label: 'Serie 2',
                  reps: '12 reps',
                },
              ],
            },
          ],
        }),
        expect.objectContaining({
          id: 'ter',
          active: false,
          title: 'Sem treino',
          exercises: [],
        }),
      ]),
    );
  });
});
