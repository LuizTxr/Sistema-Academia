import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTreinoExercicioDto {
  @IsOptional()
  @IsInt()
  exercicioId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  series?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  repeticoes?: number;

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
