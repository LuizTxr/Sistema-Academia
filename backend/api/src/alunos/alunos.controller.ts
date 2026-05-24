import { Controller, Post, Get, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller('alunos')
export class AlunosController {

  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  criar(@Body() data: CreateAlunoDto) {
    return this.alunosService.criarAluno(data);
  }

  @Get()
  listar() {
    return this.alunosService.listarAlunos();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.alunosService.buscarAlunoPorId(Number(id));
  }

  @Get(':id/treinos')
  buscarTreinos(@Param('id', ParseIntPipe) id: number) {
    return this.alunosService.buscarTreinosDoAluno(id);
  }

  @Put(':id/treinos/:diaSemana/progresso')
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
atualizar(@Param('id') id: string, @Body() data: UpdateAlunoDto) {
  return this.alunosService.atualizarAluno(Number(id), data);
}

@Delete(':id')
remover(@Param('id') id: string) {
  return this.alunosService.removerAluno(Number(id));
}

}