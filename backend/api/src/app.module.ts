import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunosModule } from './alunos/alunos.module';

@Module({
  imports: [AlunosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
