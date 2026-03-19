import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUserGuard } from '../auth/authenticated-user.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProfessorGuard } from '../auth/professor.guard';
import type { AuthenticatedUser } from '../auth/authenticated-user.type';
import { CreateTreinoExercicioDto } from './dto/create-treino-exercicio.dto';
import { UpdateTreinoExercicioDto } from './dto/update-treino-exercicio.dto';
import { TreinoExerciciosService } from './treino-exercicios.service';

@Controller()
@UseGuards(AuthenticatedUserGuard, ProfessorGuard)
@ApiTags('treino-exercicios')
@ApiHeader({
  name: 'x-user-role',
  description: 'Deve ser professor para alterar itens de treino',
  required: true,
})
@ApiHeader({
  name: 'x-user-id',
  description: 'Id do professor autenticado no banco',
  required: true,
})
export class TreinoExerciciosController {
  constructor(
    private readonly treinoExerciciosService: TreinoExerciciosService,
  ) {}

  @Post('treino-exercicios')
  @ApiOperation({ summary: 'Cria item de treino do professor autenticado' })
  criar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: CreateTreinoExercicioDto,
  ) {
    return this.treinoExerciciosService.criarParaProfessor(user, data);
  }

  @Patch('treino-exercicios/:id')
  @ApiOperation({ summary: 'Atualiza item de treino do professor autenticado' })
  @ApiParam({ name: 'id', example: 1 })
  atualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: UpdateTreinoExercicioDto,
  ) {
    return this.treinoExerciciosService.atualizarParaProfessor(
      user,
      Number(id),
      data,
    );
  }

  @Delete('treino-exercicios/:id')
  @ApiOperation({ summary: 'Remove item de treino do professor autenticado' })
  @ApiParam({ name: 'id', example: 1 })
  remover(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.treinoExerciciosService.removerParaProfessor(user, Number(id));
  }
}
