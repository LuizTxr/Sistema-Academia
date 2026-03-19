import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginAlunoDto } from '../alunos/dto/login-aluno.dto';
import { AlunoPortalService } from './aluno-portal.service';

@Controller()
export class AlunoPortalController {
  constructor(private readonly alunoPortalService: AlunoPortalService) {}

  @Post('auth/aluno/login')
  login(@Body() data: LoginAlunoDto) {
    return this.alunoPortalService.login(data.matricula);
  }

  @Get('alunos/:matricula/treinos')
  listarTreinos(@Param('matricula') matricula: string) {
    return this.alunoPortalService.listWorkoutDays(matricula);
  }
}
