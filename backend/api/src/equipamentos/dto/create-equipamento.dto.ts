import { IsString, IsOptional } from 'class-validator';

export class CreateEquipamentoDto {

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

}