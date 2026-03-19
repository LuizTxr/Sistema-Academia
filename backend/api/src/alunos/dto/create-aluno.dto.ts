import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
