import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { AlunosService } from './alunos.service';

@Controller('alunos')
export class AlunosController {

  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  criar(@Body() data: any) {
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

@Delete(':id')
remover(@Param('id') id: string) {
  return this.alunosService.removerAluno(Number(id));
}

}