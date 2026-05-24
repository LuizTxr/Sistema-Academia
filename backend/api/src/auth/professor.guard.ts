import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user.type';

type RequestWithUser = Request & {
  user?: AuthenticatedUser;
};

@Injectable()
export class ProfessorGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (request.user?.role !== 'professor') {
      throw new ForbiddenException('Apenas professores podem acessar');
    }

    return true;
  }
}
