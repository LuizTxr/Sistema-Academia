import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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

  @Get(':id/treinos')
  @ApiOperation({ summary: 'Busca treinos do aluno por dia da semana' })
  @ApiParam({ name: 'id', example: 1 })
  buscarTreinos(@Param('id', ParseIntPipe) id: number) {
    return this.alunosService.buscarTreinosDoAluno(id);
  }

  @Put(':id/treinos/:diaSemana/progresso')
  @ApiOperation({ summary: 'Salva progresso do treino de um dia' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiParam({ name: 'diaSemana', example: 'seg' })
  salvarProgresso(
    @Param('id', ParseIntPipe) id: number,
    @Param('diaSemana') diaSemana: string,
    @Body() body: { seriesConcluidas: string[]; exerciciosConcluidos: string[] },
  ) {
    return this.alunosService.salvarProgresso(
      id,
      diaSemana,
      body.seriesConcluidas,
      body.exerciciosConcluidos,
    );
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
