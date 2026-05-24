import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUserGuard } from '../auth/authenticated-user.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProfessorGuard } from '../auth/professor.guard';
import type { AuthenticatedUser } from '../auth/authenticated-user.type';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { TreinosService } from './treinos.service';

@Controller('treinos')
@UseGuards(AuthenticatedUserGuard)
@ApiTags('treinos')
@ApiHeader({
  name: 'x-user-role',
  description: 'Identidade transitoria do usuario autenticado: aluno ou professor',
  required: true,
})
@ApiHeader({
  name: 'x-user-id',
  description: 'Id do usuario autenticado no banco',
  required: true,
})
export class TreinosController {
  constructor(private readonly treinosService: TreinosService) {}

  @Post()
  @UseGuards(ProfessorGuard)
  @ApiOperation({ summary: 'Cria treino do professor autenticado' })
  criar(@CurrentUser() user: AuthenticatedUser, @Body() data: CreateTreinoDto) {
    return this.treinosService.criarParaProfessor(user, data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista treinos visiveis para o usuario autenticado' })
  @ApiQuery({ name: 'alunoId', required: false, example: 2 })
  @ApiQuery({ name: 'professorId', required: false, example: 1 })
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query('alunoId') alunoId?: string,
    @Query('professorId') professorId?: string,
  ) {
    return this.treinosService.listarParaUsuario(user, {
      alunoId: alunoId ? Number(alunoId) : undefined,
      professorId: professorId ? Number(professorId) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca treino por id respeitando autorizacao' })
  @ApiParam({ name: 'id', example: 1 })
  buscarPorId(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.treinosService.buscarPorIdParaUsuario(user, Number(id));
  }

  @Put(':id')
  @UseGuards(ProfessorGuard)
  @ApiOperation({ summary: 'Atualiza treino do professor autenticado' })
  @ApiParam({ name: 'id', example: 1 })
  atualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: UpdateTreinoDto,
  ) {
    return this.treinosService.atualizarParaProfessor(user, Number(id), data);
  }

  @Delete(':id')
  @UseGuards(ProfessorGuard)
  @ApiOperation({ summary: 'Remove treino do professor autenticado' })
  @ApiParam({ name: 'id', example: 1 })
  remover(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.treinosService.removerParaProfessor(user, Number(id));
  }
}
