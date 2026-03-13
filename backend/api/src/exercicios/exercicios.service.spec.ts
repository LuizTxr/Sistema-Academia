import { Test, TestingModule } from '@nestjs/testing';
import { ExerciciosService } from './exercicios.service';

describe('ExerciciosService', () => {
  let service: ExerciciosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciciosService],
    }).compile();

    service = module.get<ExerciciosService>(ExerciciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
