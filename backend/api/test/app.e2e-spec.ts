import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let fixtures: {
    alunos: {
      lucas: { id: number; matricula: string };
      marina: { id: number; matricula: string };
    };
    professores: {
      joao: { id: number };
      paula: { id: number };
    };
    exercicios: {
      supino: { id: number };
      bike: { id: number };
    };
    treinos: {
      lucas: { id: number };
      marina: { id: number };
    };
    treinoExercicios: {
      lucas: { id: number };
    };
  };

  async function seedDatabase() {
    await prisma.treinoExercicio.deleteMany();
    await prisma.treino.deleteMany();
    await prisma.exercicio.deleteMany();
    await prisma.equipamento.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.professor.deleteMany();

    const [joao, paula] = await Promise.all([
      prisma.professor.create({
        data: {
          nome: 'Joao Silva',
          email: 'joao.e2e@academia.com',
          especialidade: 'Musculacao',
        },
      }),
      prisma.professor.create({
        data: {
          nome: 'Paula Lima',
          email: 'paula.e2e@academia.com',
          especialidade: 'Condicionamento',
        },
      }),
    ]);

    const [equipamentoSupino, equipamentoBike] = await Promise.all([
      prisma.equipamento.create({
        data: { nome: 'Banco de supino E2E', tipo: 'Livre' },
      }),
      prisma.equipamento.create({
        data: { nome: 'Bike E2E', tipo: 'Cardio' },
      }),
    ]);

    const [supino, bike] = await Promise.all([
      prisma.exercicio.create({
        data: {
          nome: 'Supino reto E2E',
          grupoMuscular: 'Peito',
          equipamentoId: equipamentoSupino.id,
        },
      }),
      prisma.exercicio.create({
        data: {
          nome: 'Bike E2E',
          grupoMuscular: 'Cardio',
          equipamentoId: equipamentoBike.id,
        },
      }),
    ]);

    const [lucas, marina] = await Promise.all([
      prisma.aluno.create({
        data: {
          nome: 'Lucas Andrade',
          email: 'lucas.e2e@academia.com',
          matricula: '1001',
        },
      }),
      prisma.aluno.create({
        data: {
          nome: 'Marina Costa',
          email: 'marina.e2e@academia.com',
          matricula: '2002',
        },
      }),
    ]);

    const [treinoLucas, treinoMarina] = await Promise.all([
      prisma.treino.create({
        data: {
          nome: 'Treino A',
          diaSemana: 'seg',
          objetivo: 'Hipertrofia',
          alunoId: lucas.id,
          professorId: joao.id,
        },
      }),
      prisma.treino.create({
        data: {
          nome: 'Treino B',
          diaSemana: 'qua',
          objetivo: 'Condicionamento',
          alunoId: marina.id,
          professorId: paula.id,
        },
      }),
    ]);

    const treinoExercicioLucas = await prisma.treinoExercicio.create({
      data: {
        treinoId: treinoLucas.id,
        exercicioId: supino.id,
        series: 3,
        repeticoes: 12,
        carga: 40,
        descanso: 60,
        ordem: 1,
      },
    });

    await prisma.treinoExercicio.create({
      data: {
        treinoId: treinoMarina.id,
        exercicioId: bike.id,
        series: 4,
        repeticoes: 5,
        descanso: 45,
        ordem: 1,
      },
    });

    fixtures = {
      alunos: {
        lucas: { id: lucas.id, matricula: lucas.matricula },
        marina: { id: marina.id, matricula: marina.matricula },
      },
      professores: {
        joao: { id: joao.id },
        paula: { id: paula.id },
      },
      exercicios: {
        supino: { id: supino.id },
        bike: { id: bike.id },
      },
      treinos: {
        lucas: { id: treinoLucas.id },
        marina: { id: treinoMarina.id },
      },
      treinoExercicios: {
        lucas: { id: treinoExercicioLucas.id },
      },
    };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await seedDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('POST /auth/aluno/login autentica aluno por matricula', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/aluno/login')
      .send({ matricula: fixtures.alunos.lucas.matricula })
      .expect(201);

    expect(response.body).toMatchObject({
      enrollmentCode: fixtures.alunos.lucas.matricula,
      studentName: 'Lucas Andrade',
      studentGoal: 'Hipertrofia',
    });
  });

  it('GET /alunos/:matricula/treinos retorna dias de treino do aluno', async () => {
    const response = await request(app.getHttpServer())
      .get(`/alunos/${fixtures.alunos.lucas.matricula}/treinos`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'seg',
          active: true,
          title: 'Treino A',
        }),
      ]),
    );
  });

  it('GET /treinos exige autenticacao transitória', () => {
    return request(app.getHttpServer()).get('/treinos').expect(401);
  });

  it('GET /treinos permite que aluno consulte apenas os proprios treinos', async () => {
    const response = await request(app.getHttpServer())
      .get('/treinos')
      .set('x-user-role', 'aluno')
      .set('x-user-id', String(fixtures.alunos.lucas.id))
      .query({ alunoId: fixtures.alunos.marina.id })
      .expect(403);

    expect(response.body.message).toBe(
      'Aluno so pode consultar os proprios treinos',
    );
  });

  it('GET /treinos lista treinos do professor autenticado', async () => {
    const response = await request(app.getHttpServer())
      .get('/treinos')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: fixtures.treinos.lucas.id,
      professorId: fixtures.professores.joao.id,
      alunoId: fixtures.alunos.lucas.id,
      nome: 'Treino A',
    });
  });

  it('GET /treinos lista treinos do proprio aluno autenticado', async () => {
    const response = await request(app.getHttpServer())
      .get('/treinos')
      .set('x-user-role', 'aluno')
      .set('x-user-id', String(fixtures.alunos.lucas.id))
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: fixtures.treinos.lucas.id,
      alunoId: fixtures.alunos.lucas.id,
      nome: 'Treino A',
    });
  });

  it('GET /treinos/:id bloqueia professor ao consultar treino de outro professor', async () => {
    const response = await request(app.getHttpServer())
      .get(`/treinos/${fixtures.treinos.marina.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(403);

    expect(response.body.message).toBe(
      'Professor so pode consultar treinos vinculados a si mesmo',
    );
  });

  it('GET /treinos/:id permite que aluno consulte o proprio treino', async () => {
    const response = await request(app.getHttpServer())
      .get(`/treinos/${fixtures.treinos.lucas.id}`)
      .set('x-user-role', 'aluno')
      .set('x-user-id', String(fixtures.alunos.lucas.id))
      .expect(200);

    expect(response.body).toMatchObject({
      id: fixtures.treinos.lucas.id,
      alunoId: fixtures.alunos.lucas.id,
      professorId: fixtures.professores.joao.id,
    });
  });

  it('GET /treinos/:id retorna 404 para treino inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/treinos/999999')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(404);

    expect(response.body.message).toBe('Treino nao encontrado');
  });

  it('POST /treinos permite criar treino apenas para o professor autenticado', async () => {
    const response = await request(app.getHttpServer())
      .post('/treinos')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        nome: 'Treino C',
        diaSemana: 'sex',
        objetivo: 'Forca',
        alunoId: fixtures.alunos.lucas.id,
        professorId: fixtures.professores.paula.id,
      })
      .expect(403);

    expect(response.body.message).toBe(
      'Professor so pode criar treino proprio',
    );
  });

  it('POST /treinos cria treino para o professor autenticado', async () => {
    const response = await request(app.getHttpServer())
      .post('/treinos')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        nome: 'Treino C',
        diaSemana: 'sex',
        objetivo: 'Forca',
        alunoId: fixtures.alunos.lucas.id,
        professorId: fixtures.professores.joao.id,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      nome: 'Treino C',
      diaSemana: 'sex',
      objetivo: 'Forca',
      alunoId: fixtures.alunos.lucas.id,
      professorId: fixtures.professores.joao.id,
    });
  });

  it('POST /treinos retorna 400 para payload invalido', async () => {
    const response = await request(app.getHttpServer())
      .post('/treinos')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        nome: '',
        diaSemana: 'sex',
        objetivo: 'Forca',
        alunoId: fixtures.alunos.lucas.id,
        professorId: fixtures.professores.joao.id,
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('PUT /treinos/:id atualiza treino do professor autenticado', async () => {
    const response = await request(app.getHttpServer())
      .put(`/treinos/${fixtures.treinos.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        nome: 'Treino A Atualizado',
        objetivo: 'Resistencia',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: fixtures.treinos.lucas.id,
      nome: 'Treino A Atualizado',
      objetivo: 'Resistencia',
    });
  });

  it('DELETE /treinos/:id remove treino do professor autenticado', async () => {
    await request(app.getHttpServer())
      .delete(`/treinos/${fixtures.treinos.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(200);

    await request(app.getHttpServer())
      .get(`/treinos/${fixtures.treinos.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(404);
  });

  it('POST /treino-exercicios bloqueia professor ao alterar treino de outro professor', async () => {
    const response = await request(app.getHttpServer())
      .post('/treino-exercicios')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        treinoId: fixtures.treinos.marina.id,
        exercicioId: fixtures.exercicios.bike.id,
        series: 3,
        repeticoes: 10,
        descanso: 60,
        ordem: 2,
      })
      .expect(403);

    expect(response.body.message).toBe(
      'Professor so pode alterar itens de treino proprio',
    );
  });

  it('POST /treino-exercicios cria item de treino para professor dono', async () => {
    const response = await request(app.getHttpServer())
      .post('/treino-exercicios')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        treinoId: fixtures.treinos.lucas.id,
        exercicioId: fixtures.exercicios.supino.id,
        series: 4,
        repeticoes: 10,
        descanso: 75,
        ordem: 2,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      treinoId: fixtures.treinos.lucas.id,
      exercicioId: fixtures.exercicios.supino.id,
      series: 4,
      repeticoes: 10,
      descanso: 75,
      ordem: 2,
    });
  });

  it('POST /treino-exercicios retorna 404 para treino inexistente', async () => {
    const response = await request(app.getHttpServer())
      .post('/treino-exercicios')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        treinoId: 999999,
        exercicioId: fixtures.exercicios.supino.id,
        series: 4,
        repeticoes: 10,
      })
      .expect(404);

    expect(response.body.message).toBe('Treino nao encontrado');
  });

  it('POST /treino-exercicios retorna 400 para payload invalido', async () => {
    const response = await request(app.getHttpServer())
      .post('/treino-exercicios')
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        treinoId: fixtures.treinos.lucas.id,
        exercicioId: fixtures.exercicios.supino.id,
        series: 0,
        repeticoes: 10,
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining(['series must not be less than 1']),
    );
  });

  it('PATCH /treino-exercicios/:id permite professor dono atualizar o proprio item', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/treino-exercicios/${fixtures.treinoExercicios.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .send({
        series: 5,
        repeticoes: 8,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: fixtures.treinoExercicios.lucas.id,
      series: 5,
      repeticoes: 8,
    });
  });

  it('DELETE /treino-exercicios/:id remove item do professor dono', async () => {
    await request(app.getHttpServer())
      .delete(`/treino-exercicios/${fixtures.treinoExercicios.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(200);

    const treinoResponse = await request(app.getHttpServer())
      .get(`/treinos/${fixtures.treinos.lucas.id}`)
      .set('x-user-role', 'professor')
      .set('x-user-id', String(fixtures.professores.joao.id))
      .expect(200);

    expect(treinoResponse.body.exercicios).toEqual([]);
  });
});
