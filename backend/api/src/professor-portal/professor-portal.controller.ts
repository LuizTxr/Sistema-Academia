import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginProfessorDto } from './dto/login-professor.dto';
import { ProfessorPortalService } from './professor-portal.service';

@Controller()
@ApiTags('professor-portal')
export class ProfessorPortalController {
  constructor(
    private readonly professorPortalService: ProfessorPortalService,
  ) {}

  @Post('auth/professor/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login transitorio do professor por e-mail e senha' })
  login(@Body() data: LoginProfessorDto) {
    return this.professorPortalService.login(data.email, data.senha);
  }
}
