import { Controller, Post, Body } from '@nestjs/common';
import { AlunosService } from './alunos.service';

@Controller('alunos')
export class AlunosController {

  constructor(private alunosService: AlunosService) {}

  @Post()
  criar(@Body() data: any) {
    return this.alunosService.criarAluno(data);
  }

}