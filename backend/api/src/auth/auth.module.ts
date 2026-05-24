import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticatedUserGuard } from './authenticated-user.guard';
import { ProfessorGuard } from './professor.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthenticatedUserGuard, ProfessorGuard],
  exports: [AuthenticatedUserGuard, ProfessorGuard],
})
export class AuthModule {}
