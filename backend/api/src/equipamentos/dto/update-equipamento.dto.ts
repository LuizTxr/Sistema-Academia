import { IsOptional, IsString } from 'class-validator';

export class UpdateEquipamentoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
