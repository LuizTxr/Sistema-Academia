import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfessorDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}
