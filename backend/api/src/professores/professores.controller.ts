import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessoresService } from './professores.service';

@Controller('professores')
@ApiTags('professores')
export class ProfessoresController {
  constructor(private readonly professoresService: ProfessoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cria professor' })
  criar(@Body() data: CreateProfessorDto) {
    return this.professoresService.criar(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista professores' })
  listar() {
    return this.professoresService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca professor por id' })
  @ApiParam({ name: 'id', example: 1 })
  buscarPorId(@Param('id') id: string) {
    return this.professoresService.buscarPorId(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza professor' })
  @ApiParam({ name: 'id', example: 1 })
  atualizar(@Param('id') id: string, @Body() data: UpdateProfessorDto) {
    return this.professoresService.atualizar(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove professor' })
  @ApiParam({ name: 'id', example: 1 })
  remover(@Param('id') id: string) {
    return this.professoresService.remover(Number(id));
  }
}
