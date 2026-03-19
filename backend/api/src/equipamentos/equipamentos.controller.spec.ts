import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosController } from './equipamentos.controller';
import { EquipamentosService } from './equipamentos.service';

describe('EquipamentosController', () => {
  let controller: EquipamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamentosController],
      providers: [
        {
          provide: EquipamentosService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EquipamentosController>(EquipamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
