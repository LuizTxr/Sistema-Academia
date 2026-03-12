import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto';

@Controller('equipamentos')
export class EquipamentosController {

  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
criar(@Body() data: CreateEquipamentoDto) {
  return this.equipamentosService.criar(data);
}

  @Get()
  listar() {
    return this.equipamentosService.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.equipamentosService.buscarPorId(Number(id));
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() data: any) {
    return this.equipamentosService.atualizar(Number(id), data);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.equipamentosService.remover(Number(id));
  }
}