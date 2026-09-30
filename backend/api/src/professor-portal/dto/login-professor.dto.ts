import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginProfessorDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
