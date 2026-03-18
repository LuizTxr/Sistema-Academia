import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateExercicioDto {

    @ApiProperty({
        example: 'Supino reto',
        description: 'Nome do exercício'
    })
    @IsString()
    nome: string;

    @ApiProperty({
        example: 'Peito',
        description: 'Grupo muscular principal'
    })
    @IsString()
    grupoMuscular: string;

    @ApiProperty({
        example: 1,
        description: 'ID do equipamento utilizado'
    })
    @IsInt()
    equipamentoId: number;

}
