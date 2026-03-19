import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosService } from './equipamentos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EquipamentosService', () => {
  let service: EquipamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipamentosService,
        {
          provide: PrismaService,
          useValue: {
            equipamento: {},
          },
        },
      ],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
