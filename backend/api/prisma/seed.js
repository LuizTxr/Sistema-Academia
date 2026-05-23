require("dotenv").config()

const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const alunos = [
    { matricula: "1001", nome: "Lucas Andrade",   email: "lucas@academia.com"    },
    { matricula: "1002", nome: "Marina Costa",    email: "marina@academia.com"   },
    { matricula: "1003", nome: "Rafael Souza",    email: "rafael@academia.com"   },
    { matricula: "1004", nome: "Juliana Lima",    email: "juliana@academia.com"  },
    { matricula: "1005", nome: "Bruno Mendes",    email: "bruno@academia.com"    },
    { matricula: "1006", nome: "Camila Ferreira", email: "camila@academia.com"   },
    { matricula: "1007", nome: "Diego Oliveira",  email: "diego@academia.com"    },
    { matricula: "1008", nome: "Fernanda Rocha",  email: "fernanda@academia.com" },
    { matricula: "1009", nome: "Gustavo Nunes",   email: "gustavo@academia.com"  },
    { matricula: "1010", nome: "Helena Martins",  email: "helena@academia.com"   },
]

const diasSemana = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]

const treinosDisponiveis = [
    {
        nome: "Treino A", objetivo: "Hipertrofia",
        exercicios: [
            {
                nome: "Supino reto", grupoMuscular: "Peito", equipamento: "Supino",
                observacao: "Movimento controlado e descanso de 60 segundos.",
                series: 3, repeticoes: 12, carga: 40, descanso: 60, ordem: 1
            },
            {
                nome: "Crucifixo maquina", grupoMuscular: "Peito", equipamento: "Fly",
                observacao: null,
                series: 3, repeticoes: 15, carga: 20, descanso: 60, ordem: 2
            },
        ]
    },
    {
        nome: "Treino B", objetivo: "Hipertrofia",
        exercicios: [
            {
                nome: "Agachamento livre", grupoMuscular: "Pernas", equipamento: "Barra",
                observacao: "Priorizar amplitude e controle de tronco.",
                series: 3, repeticoes: 12, carga: 60, descanso: 90, ordem: 1
            },
            {
                nome: "Leg press", grupoMuscular: "Pernas", equipamento: "Leg Press",
                observacao: null,
                series: 3, repeticoes: 15, carga: 100, descanso: 60, ordem: 2
            },
        ]
    },
    {
        nome: "Treino C", objetivo: "Hipertrofia",
        exercicios: [
            {
                nome: "Puxada frontal", grupoMuscular: "Costas", equipamento: "Polia",
                observacao: null,
                series: 3, repeticoes: 12, carga: 50, descanso: 60, ordem: 1
            },
            {
                nome: "Remada curvada", grupoMuscular: "Costas", equipamento: "Barra",
                observacao: "Manter coluna neutra durante o movimento.",
                series: 4, repeticoes: 10, carga: 50, descanso: 60, ordem: 2
            },
        ]
    },
    {
        nome: "Treino D", objetivo: "Hipertrofia",
        exercicios: [
            {
                nome: "Desenvolvimento com halteres", grupoMuscular: "Ombros", equipamento: "Halteres",
                observacao: null,
                series: 3, repeticoes: 12, carga: 14, descanso: 60, ordem: 1
            },
            {
                nome: "Elevacao lateral", grupoMuscular: "Ombros", equipamento: "Halteres",
                observacao: null,
                series: 3, repeticoes: 15, carga: 8, descanso: 45, ordem: 2
            },
        ]
    },
    {
        nome: "Treino E", objetivo: "Hipertrofia",
        exercicios: [
            {
                nome: "Rosca direta", grupoMuscular: "Biceps", equipamento: "Barra",
                observacao: null,
                series: 3, repeticoes: 12, carga: 30, descanso: 60, ordem: 1
            },
            {
                nome: "Triceps pulley", grupoMuscular: "Triceps", equipamento: "Polia",
                observacao: null,
                series: 3, repeticoes: 12, carga: 25, descanso: 60, ordem: 2
            },
        ]
    },
    {
        nome: "Treino F", objetivo: "Condicionamento",
        exercicios: [
            {
                nome: "Stiff", grupoMuscular: "Posterior", equipamento: "Barra",
                observacao: "Manter joelhos levemente flexionados.",
                series: 3, repeticoes: 12, carga: 40, descanso: 60, ordem: 1
            },
            {
                nome: "Cadeira extensora", grupoMuscular: "Quadriceps", equipamento: "Cadeira Extensora",
                observacao: null,
                series: 3, repeticoes: 15, carga: 35, descanso: 45, ordem: 2
            },
        ]
    },
    {
        nome: "Treino G", objetivo: "Condicionamento",
        exercicios: [
            {
                nome: "Prancha abdominal", grupoMuscular: "Core", equipamento: "Solo",
                observacao: "Manter o corpo alinhado por 30 a 60 segundos.",
                series: 3, repeticoes: 1, carga: 0, descanso: 45, ordem: 1
            },
            {
                nome: "Abdominal supra", grupoMuscular: "Core", equipamento: "Solo",
                observacao: null,
                series: 3, repeticoes: 20, carga: 0, descanso: 45, ordem: 2
            },
        ]
    },
]

function embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5)
}

function gerarSemanaAleatoria() {
    const qtdAtivos = 5 + Math.floor(Math.random() * 3) // 5, 6 ou 7
    const diasEmbaralhados = embaralhar(diasSemana)
    const treinosSelecionados = embaralhar(treinosDisponiveis).slice(0, qtdAtivos)
    const diasAtivos = diasEmbaralhados.slice(0, qtdAtivos)
    const diasDescanso = diasEmbaralhados.slice(qtdAtivos)

    const semana = diasAtivos.map((dia, i) => ({
        diaSemana: dia,
        ativo: true,
        nome: treinosSelecionados[i].nome,
        objetivo: treinosSelecionados[i].objetivo,
        exercicios: treinosSelecionados[i].exercicios,
    }))

    diasDescanso.forEach((dia) => {
        semana.push({ diaSemana: dia, ativo: false, nome: "Sem treino", objetivo: "", exercicios: [] })
    })

    return semana
}

async function upsertEquipamento(nome) {
    return prisma.equipamento.upsert({
        where: { nome },
        update: {},
        create: { nome, tipo: "Maquina" },
    })
}

async function upsertExercicio(nome, grupoMuscular, equipamentoId) {
    return prisma.exercicio.upsert({
        where: { nome },
        update: {},
        create: { nome, grupoMuscular, equipamentoId },
    })
}

async function main() {
    const professor = await prisma.professor.upsert({
        where: { email: "professor@academia.com" },
        update: {},
        create: { nome: "João Silva", email: "professor@academia.com", especialidade: "Musculação" },
    })

    for (const alunoData of alunos) {
        const aluno = await prisma.aluno.upsert({
            where:  { matricula: alunoData.matricula },
            update: { nome: alunoData.nome, email: alunoData.email },
            create: alunoData,
        })

        for (const diaData of gerarSemanaAleatoria()) {
            const treinoExistente = await prisma.treino.findFirst({
                where: { alunoId: aluno.id, diaSemana: diaData.diaSemana }
            })

            if (treinoExistente) continue

            const treino = await prisma.treino.create({
                data: {
                    nome:       diaData.nome,
                    diaSemana:  diaData.diaSemana,
                    ativo:      diaData.ativo,
                    objetivo:   diaData.objetivo,
                    alunoId:    aluno.id,
                    professorId: professor.id,
                }
            })

            for (const ex of diaData.exercicios) {
                const equipamento = await upsertEquipamento(ex.equipamento)
                const exercicio   = await upsertExercicio(ex.nome, ex.grupoMuscular, equipamento.id)

                await prisma.treinoExercicio.create({
                    data: {
                        treinoId:    treino.id,
                        exercicioId: exercicio.id,
                        series:      ex.series,
                        repeticoes:  ex.repeticoes,
                        carga:       ex.carga,
                        descanso:    ex.descanso,
                        observacao:  ex.observacao,
                        ordem:       ex.ordem,
                    }
                })
            }
        }
    }

    console.log(`Seed concluído: ${alunos.length} alunos com semana de treinos inseridos.`)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
