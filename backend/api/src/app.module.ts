import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';

@Module({
  imports: [
    PrismaModule,
    EquipamentosModule,
  ],
})
export class AppModule {}