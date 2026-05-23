import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAlunoDto } from './dto/login-aluno.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('aluno/login')
  @ApiOperation({ summary: 'Login do aluno por matrícula' })
  loginAluno(@Body() dto: LoginAlunoDto) {
    return this.authService.loginAluno(dto.matricula);
  }
}
