import { Module } from '@nestjs/common';
import { TreinosController } from './treinos.controller';
import { TreinosService } from './treinos.service';

@Module({
  controllers: [TreinosController],
  providers: [TreinosService],
  exports: [TreinosService],
})
export class TreinosModule {}
