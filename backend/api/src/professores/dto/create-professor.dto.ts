import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfessorDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}
