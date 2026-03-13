import { Module } from '@nestjs/common';
import { ExerciciosController } from './exercicios.controller';
import { ExerciciosService } from './exercicios.service';

@Module({
  controllers: [ExerciciosController],
  providers: [ExerciciosService],
})
export class ExerciciosModule { }
