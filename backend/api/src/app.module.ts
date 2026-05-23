import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AlunosModule } from './alunos/alunos.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ExerciciosModule } from './exercicios/exercicios.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AlunosModule,
    EquipamentosModule,
    ExerciciosModule,
  ],
})
export class AppModule {}