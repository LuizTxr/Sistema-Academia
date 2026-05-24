import { ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserGuard } from './authenticated-user.guard';

describe('AuthenticatedUserGuard', () => {
  it('should attach user when headers are valid', () => {
    const guard = new AuthenticatedUserGuard();
    const request = {
      headers: {
        'x-user-role': 'professor',
        'x-user-id': '2',
      },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect((request as any).user).toEqual({ id: 2, role: 'professor' });
  });
});
