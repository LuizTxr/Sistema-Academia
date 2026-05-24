import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AlunosModule } from './alunos/alunos.module';
import { AlunoPortalModule } from './aluno-portal/aluno-portal.module';
import { ProfessoresModule } from './professores/professores.module';
import { TreinosModule } from './treinos/treinos.module';
import { TreinoExerciciosModule } from './treino-exercicios/treino-exercicios.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ExerciciosModule } from './exercicios/exercicios.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AlunosModule,
    AlunoPortalModule,
    ProfessoresModule,
    TreinosModule,
    TreinoExerciciosModule,
    EquipamentosModule,
    ExerciciosModule,
  ],
})
export class AppModule {}
