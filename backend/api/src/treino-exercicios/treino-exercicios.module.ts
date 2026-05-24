import { Module } from '@nestjs/common';
import { TreinoExerciciosController } from './treino-exercicios.controller';
import { TreinoExerciciosService } from './treino-exercicios.service';

@Module({
  controllers: [TreinoExerciciosController],
  providers: [TreinoExerciciosService],
})
export class TreinoExerciciosModule {}
