import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAlunoDto {

  @IsString()
  @IsOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

}
