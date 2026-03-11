import { Controller, Post, Get, Body, Param, Delete, Put } from '@nestjs/common';
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

@Put(':id')
atualizar(@Param('id') id: string, @Body() data: UpdateAlunoDto) {
  return this.alunosService.atualizarAluno(Number(id), data);
}

@Delete(':id')
remover(@Param('id') id: string) {
  return this.alunosService.removerAluno(Number(id));
}

}