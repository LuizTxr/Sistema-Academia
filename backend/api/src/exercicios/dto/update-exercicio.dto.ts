import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateExercicioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  grupoMuscular?: string;

  @IsOptional()
  @IsInt()
  equipamentoId?: number;
}
