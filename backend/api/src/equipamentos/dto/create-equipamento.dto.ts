import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipamentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;
}
