require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function resetDatabase() {
  await prisma.treinoExercicio.deleteMany()
  await prisma.treino.deleteMany()
  await prisma.exercicio.deleteMany()
  await prisma.equipamento.deleteMany()
  await prisma.aluno.deleteMany()
  await prisma.professor.deleteMany()
}

async function createWorkout(data) {
  return prisma.treino.create({
    data,
  })
}

async function main() {
  await resetDatabase()

  const [professorPrincipal, professorCondicionamento] = await Promise.all([
    prisma.professor.create({
      data: {
        nome: 'Joao Silva',
        email: 'joao@academia.com',
        especialidade: 'Musculacao',
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Paula Lima',
        email: 'paula@academia.com',
        especialidade: 'Condicionamento',
      },
    }),
  ])

  const [
    equipamentoSupino,
    equipamentoCrucifixo,
    equipamentoAgachamento,
    equipamentoLegPress,
    equipamentoPuxada,
    equipamentoBike,
  ] = await Promise.all([
    prisma.equipamento.create({ data: { nome: 'Banco de supino', tipo: 'Livre' } }),
    prisma.equipamento.create({ data: { nome: 'Maquina peitoral', tipo: 'Maquina' } }),
    prisma.equipamento.create({ data: { nome: 'Rack', tipo: 'Livre' } }),
    prisma.equipamento.create({ data: { nome: 'Leg press', tipo: 'Maquina' } }),
    prisma.equipamento.create({ data: { nome: 'Puxador', tipo: 'Maquina' } }),
    prisma.equipamento.create({ data: { nome: 'Bike', tipo: 'Cardio' } }),
  ])

  const [supino, crucifixo, agachamento, legPress, puxada, bike] = await Promise.all([
    prisma.exercicio.create({
      data: { nome: 'Supino reto', grupoMuscular: 'Peito', equipamentoId: equipamentoSupino.id },
    }),
    prisma.exercicio.create({
      data: { nome: 'Crucifixo maquina', grupoMuscular: 'Peito', equipamentoId: equipamentoCrucifixo.id },
    }),
    prisma.exercicio.create({
      data: { nome: 'Agachamento livre', grupoMuscular: 'Pernas', equipamentoId: equipamentoAgachamento.id },
    }),
    prisma.exercicio.create({
      data: { nome: 'Leg press', grupoMuscular: 'Pernas', equipamentoId: equipamentoLegPress.id },
    }),
    prisma.exercicio.create({
      data: { nome: 'Puxada frontal', grupoMuscular: 'Costas', equipamentoId: equipamentoPuxada.id },
    }),
    prisma.exercicio.create({
      data: { nome: 'Bike', grupoMuscular: 'Cardio', equipamentoId: equipamentoBike.id },
    }),
  ])

  const [lucas, marina] = await Promise.all([
    prisma.aluno.create({
      data: {
        nome: 'Lucas Andrade',
        email: 'lucas@academia.com',
        matricula: '1001',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Marina Costa',
        email: 'marina@academia.com',
        matricula: '2002',
      },
    }),
  ])

  await Promise.all([
    createWorkout({
      nome: 'Treino A',
      diaSemana: 'seg',
      objetivo: 'Hipertrofia',
      alunoId: lucas.id,
      professorId: professorPrincipal.id,
      exercicios: {
        create: [
          {
            exercicioId: supino.id,
            series: 3,
            repeticoes: 12,
            carga: 40,
            descanso: 60,
            observacao: 'Movimento controlado e descanso de 60 segundos.',
            ordem: 1,
          },
          {
            exercicioId: crucifixo.id,
            series: 3,
            repeticoes: 12,
            carga: 25,
            descanso: 60,
            ordem: 2,
          },
        ],
      },
    }),
    createWorkout({
      nome: 'Treino B',
      diaSemana: 'ter',
      objetivo: 'Hipertrofia',
      alunoId: lucas.id,
      professorId: professorPrincipal.id,
      exercicios: {
        create: [
          {
            exercicioId: agachamento.id,
            series: 3,
            repeticoes: 10,
            carga: 50,
            descanso: 90,
            observacao: 'Priorizar amplitude e controle de tronco.',
            ordem: 1,
          },
          {
            exercicioId: legPress.id,
            series: 3,
            repeticoes: 12,
            carga: 120,
            descanso: 90,
            ordem: 2,
          },
        ],
      },
    }),
    createWorkout({
      nome: 'Treino C',
      diaSemana: 'qua',
      objetivo: 'Hipertrofia',
      alunoId: lucas.id,
      professorId: professorPrincipal.id,
      exercicios: {
        create: [
          {
            exercicioId: puxada.id,
            series: 3,
            repeticoes: 12,
            carga: 35,
            descanso: 60,
            ordem: 1,
          },
        ],
      },
    }),
    createWorkout({
      nome: 'Treino A',
      diaSemana: 'seg',
      objetivo: 'Condicionamento',
      alunoId: marina.id,
      professorId: professorCondicionamento.id,
      exercicios: {
        create: [
          {
            exercicioId: bike.id,
            series: 4,
            repeticoes: 5,
            descanso: 60,
            observacao: 'Ritmo moderado.',
            ordem: 1,
          },
        ],
      },
    }),
    createWorkout({
      nome: 'Treino B',
      diaSemana: 'qua',
      objetivo: 'Condicionamento',
      alunoId: marina.id,
      professorId: professorCondicionamento.id,
      exercicios: {
        create: [
          {
            exercicioId: legPress.id,
            series: 3,
            repeticoes: 15,
            carga: 70,
            descanso: 75,
            ordem: 1,
          },
          {
            exercicioId: bike.id,
            series: 3,
            repeticoes: 8,
            descanso: 45,
            observacao: 'Fechar cada serie com 1 minuto intenso.',
            ordem: 2,
          },
        ],
      },
    }),
  ])
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
