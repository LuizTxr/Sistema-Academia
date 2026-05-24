require("dotenv").config()

const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ---------------------------------------------------------------------------
// Dados base
// ---------------------------------------------------------------------------

const EQUIPAMENTOS = [
  { nome: 'Barra', tipo: 'Livre' },
  { nome: 'Halteres', tipo: 'Livre' },
  { nome: 'Pulley', tipo: 'Maquina' },
  { nome: 'Supino', tipo: 'Maquina' },
  { nome: 'Rack', tipo: 'Livre' },
  { nome: 'Leg Press', tipo: 'Maquina' },
  { nome: 'Mesa Flexora', tipo: 'Maquina' },
  { nome: 'Solo', tipo: 'Livre' },
]

const EXERCICIOS = [
  { nome: 'Supino reto', grupoMuscular: 'Peito', equipamento: 'Supino' },
  { nome: 'Crucifixo inclinado', grupoMuscular: 'Peito', equipamento: 'Halteres' },
  { nome: 'Triceps pulley', grupoMuscular: 'Triceps', equipamento: 'Pulley' },
  { nome: 'Puxada frontal', grupoMuscular: 'Costas', equipamento: 'Pulley' },
  { nome: 'Remada curvada', grupoMuscular: 'Costas', equipamento: 'Barra' },
  { nome: 'Rosca direta', grupoMuscular: 'Biceps', equipamento: 'Barra' },
  { nome: 'Agachamento livre', grupoMuscular: 'Quadriceps', equipamento: 'Rack' },
  { nome: 'Leg press', grupoMuscular: 'Quadriceps', equipamento: 'Leg Press' },
  { nome: 'Stiff', grupoMuscular: 'Posterior de coxa', equipamento: 'Halteres' },
  { nome: 'Desenvolvimento com halteres', grupoMuscular: 'Ombros', equipamento: 'Halteres' },
  { nome: 'Elevacao lateral', grupoMuscular: 'Ombros', equipamento: 'Halteres' },
  { nome: 'Mesa flexora', grupoMuscular: 'Posterior de coxa', equipamento: 'Mesa Flexora' },
  { nome: 'Levantamento terra', grupoMuscular: 'Posterior', equipamento: 'Barra' },
  { nome: 'Prancha', grupoMuscular: 'Core', equipamento: 'Solo' },
  { nome: 'Abdominal infra', grupoMuscular: 'Abdomen', equipamento: 'Solo' },
]

// Cada template define um dia de treino com seus exercicios
const TEMPLATES = [
  {
    nome: 'Treino A - Peito e Triceps',
    objetivo: 'Hipertrofia',
    exercicios: [
      { nome: 'Supino reto', series: 4, repeticoes: 10, carga: 60, descanso: 90, observacao: 'Controle o movimento na descida', ordem: 1 },
      { nome: 'Crucifixo inclinado', series: 3, repeticoes: 12, carga: 14, descanso: 60, observacao: null, ordem: 2 },
      { nome: 'Triceps pulley', series: 3, repeticoes: 15, carga: 25, descanso: 60, observacao: 'Mantenha os cotovelos fixos', ordem: 3 },
    ],
  },
  {
    nome: 'Treino B - Costas e Biceps',
    objetivo: 'Hipertrofia',
    exercicios: [
      { nome: 'Puxada frontal', series: 4, repeticoes: 10, carga: 55, descanso: 90, observacao: 'Retraia as escapulas', ordem: 1 },
      { nome: 'Remada curvada', series: 3, repeticoes: 10, carga: 50, descanso: 90, observacao: null, ordem: 2 },
      { nome: 'Rosca direta', series: 3, repeticoes: 12, carga: 30, descanso: 60, observacao: 'Nao balance o corpo', ordem: 3 },
    ],
  },
  {
    nome: 'Treino C - Pernas',
    objetivo: 'Hipertrofia',
    exercicios: [
      { nome: 'Agachamento livre', series: 4, repeticoes: 8, carga: 80, descanso: 120, observacao: 'Joelhos alinhados com os pes', ordem: 1 },
      { nome: 'Leg press', series: 3, repeticoes: 12, carga: 120, descanso: 90, observacao: null, ordem: 2 },
      { nome: 'Stiff', series: 3, repeticoes: 12, carga: 20, descanso: 60, observacao: 'Mantenha as costas retas', ordem: 3 },
    ],
  },
  {
    nome: 'Treino D - Ombros',
    objetivo: 'Definicao',
    exercicios: [
      { nome: 'Desenvolvimento com halteres', series: 4, repeticoes: 10, carga: 16, descanso: 90, observacao: null, ordem: 1 },
      { nome: 'Elevacao lateral', series: 3, repeticoes: 15, carga: 8, descanso: 60, observacao: 'Cotovelo ligeiramente flexionado', ordem: 2 },
      { nome: 'Triceps pulley', series: 3, repeticoes: 15, carga: 22, descanso: 60, observacao: null, ordem: 3 },
    ],
  },
  {
    nome: 'Treino E - Posterior e Core',
    objetivo: 'Definicao',
    exercicios: [
      { nome: 'Levantamento terra', series: 3, repeticoes: 6, carga: 100, descanso: 120, observacao: 'Costas retas, quadril para tras', ordem: 1 },
      { nome: 'Mesa flexora', series: 3, repeticoes: 12, carga: 35, descanso: 60, observacao: null, ordem: 2 },
      { nome: 'Prancha', series: 3, repeticoes: 1, carga: null, descanso: 45, observacao: '45 segundos por serie', ordem: 3 },
      { nome: 'Abdominal infra', series: 3, repeticoes: 20, carga: null, descanso: 45, observacao: null, ordem: 4 },
    ],
  },
  {
    nome: 'Treino F - Costas e Gluteos',
    objetivo: 'Emagrecimento',
    exercicios: [
      { nome: 'Puxada frontal', series: 3, repeticoes: 12, carga: 45, descanso: 60, observacao: null, ordem: 1 },
      { nome: 'Remada curvada', series: 3, repeticoes: 12, carga: 40, descanso: 60, observacao: null, ordem: 2 },
      { nome: 'Stiff', series: 4, repeticoes: 12, carga: 18, descanso: 60, observacao: 'Quadril para tras', ordem: 3 },
    ],
  },
  {
    nome: 'Treino G - Peito e Biceps',
    objetivo: 'Hipertrofia',
    exercicios: [
      { nome: 'Supino reto', series: 3, repeticoes: 12, carga: 50, descanso: 90, observacao: null, ordem: 1 },
      { nome: 'Crucifixo inclinado', series: 3, repeticoes: 15, carga: 12, descanso: 60, observacao: null, ordem: 2 },
      { nome: 'Rosca direta', series: 4, repeticoes: 10, carga: 28, descanso: 60, observacao: 'Concentre na contracao', ordem: 3 },
    ],
  },
]

const DIAS_SEMANA = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

const ALUNOS = [
  { nome: 'Ana Beatriz Costa',   email: 'ana.costa@email.com',      matricula: '1001' },
  { nome: 'Bruno Ferreira',      email: 'bruno.ferreira@email.com', matricula: '1002' },
  { nome: 'Carla Menezes',       email: 'carla.menezes@email.com',  matricula: '1003' },
  { nome: 'Diego Albuquerque',   email: 'diego.alb@email.com',      matricula: '1004' },
  { nome: 'Elisa Ramos',         email: 'elisa.ramos@email.com',    matricula: '1005' },
  { nome: 'Felipe Nunes',        email: 'felipe.nunes@email.com',   matricula: '1006' },
  { nome: 'Gabriela Lopes',      email: 'gabriela.lopes@email.com', matricula: '1007' },
  { nome: 'Henrique Barbosa',    email: 'henrique.b@email.com',     matricula: '1008' },
  { nome: 'Isabela Martins',     email: 'isabela.m@email.com',      matricula: '1009' },
  { nome: 'Joao Pedro Oliveira', email: 'joaopedro.o@email.com',    matricula: '1010' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

async function main() {
  // Limpa tudo na ordem certa para nao violar foreign keys
  await prisma.treinoExercicio.deleteMany()
  await prisma.treino.deleteMany()
  await prisma.aluno.deleteMany()
  await prisma.exercicio.deleteMany()
  await prisma.equipamento.deleteMany()
  await prisma.professor.deleteMany()

  const professor = await prisma.professor.create({
    data: { nome: 'Joao Silva', email: 'joao.silva@academia.com', especialidade: 'Musculacao' },
  })

  // Cria equipamentos e indexa por nome
  const equipamentos = {}
  for (const eq of EQUIPAMENTOS) {
    equipamentos[eq.nome] = await prisma.equipamento.create({ data: eq })
  }

  // Cria exercicios e indexa por nome
  const exercicios = {}
  for (const ex of EXERCICIOS) {
    exercicios[ex.nome] = await prisma.exercicio.create({
      data: {
        nome: ex.nome,
        grupoMuscular: ex.grupoMuscular,
        equipamentoId: equipamentos[ex.equipamento].id,
      },
    })
  }

  // Cria 10 alunos, cada um com 5 a 7 dias de treino
  for (let i = 0; i < ALUNOS.length; i++) {
    const aluno = await prisma.aluno.create({ data: ALUNOS[i] })

    const qtdDias = 5 + (i % 3) // 5, 6 ou 7 dias
    const diasAtivos = shuffle(DIAS_SEMANA).slice(0, qtdDias)
    const templatesDoAluno = shuffle(TEMPLATES).slice(0, qtdDias)

    for (let d = 0; d < qtdDias; d++) {
      const template = templatesDoAluno[d]

      const treino = await prisma.treino.create({
        data: {
          nome: template.nome,
          diaSemana: diasAtivos[d],
          objetivo: template.objetivo,
          alunoId: aluno.id,
          professorId: professor.id,
        },
      })

      for (const ex of template.exercicios) {
        await prisma.treinoExercicio.create({
          data: {
            treinoId: treino.id,
            exercicioId: exercicios[ex.nome].id,
            series: ex.series,
            repeticoes: ex.repeticoes,
            carga: ex.carga,
            descanso: ex.descanso,
            observacao: ex.observacao,
            ordem: ex.ordem,
          },
        })
      }
    }
  }

  console.log(`Seed concluido: ${ALUNOS.length} alunos criados, cada um com 5-7 treinos semanais.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
