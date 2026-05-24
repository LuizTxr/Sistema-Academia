import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProfessoresService } from './professores.service';

describe('ProfessoresService', () => {
  let service: ProfessoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessoresService,
        {
          provide: PrismaService,
          useValue: {
            professor: {},
          },
        },
      ],
    }).compile();

    service = module.get<ProfessoresService>(ProfessoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
