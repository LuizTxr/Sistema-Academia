import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAlunoDto {
  @ApiProperty({ example: '1001' })
  @IsString()
  @IsNotEmpty()
  matricula: string;
}
