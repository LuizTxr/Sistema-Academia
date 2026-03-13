import { Test, TestingModule } from '@nestjs/testing';
import { ExerciciosController } from './exercicios.controller';

describe('ExerciciosController', () => {
  let controller: ExerciciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciciosController],
    }).compile();

    controller = module.get<ExerciciosController>(ExerciciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
