import { Test, TestingModule } from '@nestjs/testing';
import { TreinosController } from './treinos.controller';
import { TreinosService } from './treinos.service';

describe('TreinosController', () => {
  let controller: TreinosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreinosController],
      providers: [
        {
          provide: TreinosService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TreinosController>(TreinosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
