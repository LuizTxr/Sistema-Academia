import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginAlunoDto } from '../alunos/dto/login-aluno.dto';
import { AlunoPortalService } from './aluno-portal.service';

@Controller()
@ApiTags('aluno-portal')
export class AlunoPortalController {
  constructor(private readonly alunoPortalService: AlunoPortalService) {}

  @Post('auth/aluno/login')
  @ApiOperation({ summary: 'Login transitorio do aluno por matricula' })
  login(@Body() data: LoginAlunoDto) {
    return this.alunoPortalService.login(data.matricula);
  }

  @Get('alunos/:matricula/treinos')
  @ApiOperation({ summary: 'Lista treinos do aluno por matricula' })
  @ApiParam({ name: 'matricula', example: '1001' })
  listarTreinos(@Param('matricula') matricula: string) {
    return this.alunoPortalService.listWorkoutDays(matricula);
  }
}
