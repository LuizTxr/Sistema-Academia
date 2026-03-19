import { Module } from '@nestjs/common';
import { AuthenticatedUserGuard } from './authenticated-user.guard';
import { ProfessorGuard } from './professor.guard';

@Module({
  providers: [AuthenticatedUserGuard, ProfessorGuard],
  exports: [AuthenticatedUserGuard, ProfessorGuard],
})
export class AuthModule {}
