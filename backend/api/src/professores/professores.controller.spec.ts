import { Test, TestingModule } from '@nestjs/testing';
import { ProfessoresController } from './professores.controller';
import { ProfessoresService } from './professores.service';

describe('ProfessoresController', () => {
  let controller: ProfessoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessoresController],
      providers: [
        {
          provide: ProfessoresService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProfessoresController>(ProfessoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
