import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTreinoExercicioDto {
  @IsInt()
  treinoId: number;

  @IsInt()
  exercicioId: number;

  @IsInt()
  @Min(1)
  series: number;

  @IsInt()
  @Min(1)
  repeticoes: number;

  @IsOptional()
  @IsNumber()
  carga?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  descanso?: number;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ordem?: number;
}
