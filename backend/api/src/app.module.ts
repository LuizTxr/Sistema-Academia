import { Module } from '@nestjs/common';
import { AlunosModule } from './alunos/alunos.module';
import { AlunoPortalModule } from './aluno-portal/aluno-portal.module';
import { AuthModule } from './auth/auth.module';
import { ProfessoresModule } from './professores/professores.module';
import { TreinoExerciciosModule } from './treino-exercicios/treino-exercicios.module';
import { TreinosModule } from './treinos/treinos.module';
import { PrismaModule } from './prisma/prisma.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ExerciciosModule } from './exercicios/exercicios.module';

@Module({
  imports: [
    AuthModule,
    AlunosModule,
    AlunoPortalModule,
    ProfessoresModule,
    TreinoExerciciosModule,
    TreinosModule,
    PrismaModule,
    EquipamentosModule,
    ExerciciosModule,
  ],
})
export class AppModule {}
