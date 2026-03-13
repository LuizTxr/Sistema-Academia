import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ExerciciosModule } from './exercicios/exercicios.module';

@Module({
  imports: [
    PrismaModule,
    EquipamentosModule,
    ExerciciosModule,
  ],
})
export class AppModule {}