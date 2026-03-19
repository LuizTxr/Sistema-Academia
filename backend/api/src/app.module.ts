import { Module } from '@nestjs/common';
import { AlunosModule } from './alunos/alunos.module';
import { AlunoPortalModule } from './aluno-portal/aluno-portal.module';
import { PrismaModule } from './prisma/prisma.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ExerciciosModule } from './exercicios/exercicios.module';

@Module({
  imports: [
    AlunosModule,
    AlunoPortalModule,
    PrismaModule,
    EquipamentosModule,
    ExerciciosModule,
  ],
})
export class AppModule {}
