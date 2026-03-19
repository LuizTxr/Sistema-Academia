import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTreinoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  diaSemana: string;

  @IsInt()
  professorId: number;

  @IsInt()
  alunoId: number;

  @IsString()
  @IsNotEmpty()
  objetivo: string;
}
