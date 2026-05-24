import { Test, TestingModule } from '@nestjs/testing';
import { ExerciciosController } from './exercicios.controller';
import { ExerciciosService } from './exercicios.service';

describe('ExerciciosController', () => {
  let controller: ExerciciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciciosController],
      providers: [
        {
          provide: ExerciciosService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ExerciciosController>(ExerciciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
