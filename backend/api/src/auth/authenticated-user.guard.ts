import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user.type';

type RequestWithHeadersAndUser = Request & {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
};

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request =
      context.switchToHttp().getRequest<RequestWithHeadersAndUser>();
    const roleHeader = request.headers['x-user-role'];
    const idHeader = request.headers['x-user-id'];
    const role = Array.isArray(roleHeader) ? roleHeader[0] : roleHeader;
    const id = Number(Array.isArray(idHeader) ? idHeader[0] : idHeader);

    if (!role || (role !== 'aluno' && role !== 'professor')) {
      throw new UnauthorizedException('Cabecalho x-user-role invalido');
    }

    if (!Number.isInteger(id) || id <= 0) {
      throw new UnauthorizedException('Cabecalho x-user-id invalido');
    }

    request.user = {
      id,
      role,
    };

    return true;
  }
}
