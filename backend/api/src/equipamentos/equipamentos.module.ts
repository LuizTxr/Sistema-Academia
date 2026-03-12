import { Module } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { EquipamentosController } from './equipamentos.controller';

@Module({
  controllers: [EquipamentosController],
  providers: [EquipamentosService],
})
export class EquipamentosModule {}