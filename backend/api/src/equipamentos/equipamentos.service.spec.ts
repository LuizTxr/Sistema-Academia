import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosService } from './equipamentos.service';

describe('EquipamentosService', () => {
  let service: EquipamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipamentosService],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
