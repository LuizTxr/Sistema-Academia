import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ExerciciosService } from './exercicios.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';

@Controller('exercicios')
@ApiTags('exercicios')
export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista exercicios' })
  findAll() {
    return this.exerciciosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca exercicio por id' })
  @ApiParam({ name: 'id', example: 1 })
  findById(@Param('id') id: string) {
    return this.exerciciosService.findById(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Cria exercicio' })
  create(@Body() data: CreateExercicioDto) {
    return this.exerciciosService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza exercicio' })
  @ApiParam({ name: 'id', example: 1 })
  update(@Param('id') id: string, @Body() data: UpdateExercicioDto) {
    return this.exerciciosService.update(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove exercicio' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id') id: string) {
    return this.exerciciosService.remove(Number(id));
  }
}
