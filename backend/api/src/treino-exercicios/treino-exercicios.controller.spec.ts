import { Test, TestingModule } from '@nestjs/testing';
import { TreinoExerciciosController } from './treino-exercicios.controller';
import { TreinoExerciciosService } from './treino-exercicios.service';

describe('TreinoExerciciosController', () => {
  let controller: TreinoExerciciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreinoExerciciosController],
      providers: [
        {
          provide: TreinoExerciciosService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TreinoExerciciosController>(
      TreinoExerciciosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
