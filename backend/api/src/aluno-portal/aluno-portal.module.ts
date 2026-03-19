import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlunoPortalController } from './aluno-portal.controller';
import { AlunoPortalService } from './aluno-portal.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlunoPortalController],
  providers: [AlunoPortalService],
})
export class AlunoPortalModule {}
