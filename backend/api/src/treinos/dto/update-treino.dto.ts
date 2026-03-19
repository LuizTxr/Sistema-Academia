import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTreinoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  diaSemana?: string;

  @IsOptional()
  @IsInt()
  professorId?: number;

  @IsOptional()
  @IsInt()
  alunoId?: number;

  @IsOptional()
  @IsString()
  objetivo?: string;
}
