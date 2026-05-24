import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAlunoDto {
  @IsString()
  @IsNotEmpty()
  matricula: string;
}
