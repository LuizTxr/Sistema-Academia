import { Module } from '@nestjs/common';
import { AlunosModule } from '../alunos/alunos.module';
import { TreinosModule } from '../treinos/treinos.module';
import { AlunoPortalController } from './aluno-portal.controller';
import { AlunoPortalService } from './aluno-portal.service';

@Module({
  imports: [AlunosModule, TreinosModule],
  controllers: [AlunoPortalController],
  providers: [AlunoPortalService],
})
export class AlunoPortalModule {}
