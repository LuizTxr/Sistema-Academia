import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

}
