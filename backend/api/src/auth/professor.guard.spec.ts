import { ExecutionContext } from '@nestjs/common';
import { ProfessorGuard } from './professor.guard';

describe('ProfessorGuard', () => {
  it('should allow professor user', () => {
    const guard = new ProfessorGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 1,
            role: 'professor',
          },
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });
});
