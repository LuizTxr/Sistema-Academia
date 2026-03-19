import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@Controller('equipamentos')
@ApiTags('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Cria equipamento' })
  criar(@Body() data: CreateEquipamentoDto) {
    return this.equipamentosService.criar(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista equipamentos' })
  listar() {
    return this.equipamentosService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca equipamento por id' })
  @ApiParam({ name: 'id', example: 1 })
  buscar(@Param('id') id: string) {
    return this.equipamentosService.buscarPorId(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza equipamento' })
  @ApiParam({ name: 'id', example: 1 })
  atualizar(@Param('id') id: string, @Body() data: UpdateEquipamentoDto) {
    return this.equipamentosService.atualizar(Number(id), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove equipamento' })
  @ApiParam({ name: 'id', example: 1 })
  remover(@Param('id') id: string) {
    return this.equipamentosService.remover(Number(id));
  }
}
