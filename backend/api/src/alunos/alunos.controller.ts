import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
@ApiTags('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  @ApiOperation({ summary: 'Cria aluno' })
  criar(@Body() data: CreateAlunoDto) {
    return this.alunosService.criar(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista alunos' })
  listar() {
    return this.alunosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca aluno por id' })
  @ApiParam({ name: 'id', example: 1 })
  buscarPorId(@Param('id') id: string) {
    return this.alunosService.buscarPorId(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza aluno' })
  @ApiParam({ name: 'id', example: 1 })
  atualizar(@Param('id') id: string, @Body() data: UpdateAlunoDto) {
    return this.alunosService.atualizar(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove aluno' })
  @ApiParam({ name: 'id', example: 1 })
  remover(@Param('id') id: string) {
    return this.alunosService.remover(Number(id));
  }
}
