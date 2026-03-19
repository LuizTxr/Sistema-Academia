import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExercicioDto {
  @ApiProperty({
    example: 'Supino reto',
    description: 'Nome do exercicio',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'Peito',
    description: 'Grupo muscular principal',
  })
  @IsString()
  @IsNotEmpty()
  grupoMuscular: string;

  @ApiProperty({
    example: 1,
    description: 'ID do equipamento utilizado',
  })
  @IsInt()
  equipamentoId: number;
}
