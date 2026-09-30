import { Injectable, UnauthorizedException } from '@nestjs/common';
import { gerarHashSenha, verificarSenha } from '../auth/senha';
import { PrismaService } from '../prisma/prisma.service';

const HASH_FALSO = gerarHashSenha('senha-inexistente');

@Injectable()
export class ProfessorPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, senha: string) {
    const professor = await this.prisma.professor.findUnique({
      where: { email },
      include: { credencial: true },
    });

    // Sempre calcula o hash, existindo ou nao o professor, para nao revelar
    // pelo tempo de resposta quais e-mails estao cadastrados.
    const senhaValida = verificarSenha(
      senha,
      professor?.credencial?.senhaHash ?? HASH_FALSO,
    );

    if (!professor || !professor.credencial || !senhaValida) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    return {
      id: professor.id,
      nome: professor.nome,
      email: professor.email,
    };
  }
}
