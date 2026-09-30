import { Module } from '@nestjs/common';
import { ProfessorPortalController } from './professor-portal.controller';
import { ProfessorPortalService } from './professor-portal.service';

@Module({
  controllers: [ProfessorPortalController],
  providers: [ProfessorPortalService],
})
export class ProfessorPortalModule {}
