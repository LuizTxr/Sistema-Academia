require("dotenv").config()

const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({
    adapter
})

async function main() {

    const professor = await prisma.professor.create({
        data: {
            nome: "João Silva",
            email: "joao@academia.com",
            especialidade: "Musculação"
        }
    })

    const aluno = await prisma.aluno.create({
        data: {
            nome: "Maria Souza",
            email: "maria@academia.com"
        }
    })

    const equipamento = await prisma.equipamento.create({
        data: {
            nome: "Supino",
            tipo: "Máquina"
        }
    })

    const exercicio = await prisma.exercicio.create({
        data: {
            nome: "Supino reto",
            grupoMuscular: "Peito",
            equipamentoId: equipamento.id
        }
    })

    const treino = await prisma.treino.create({
        data: {
            nome: "Treino A",
            objetivo: "Hipertrofia",
            alunoId: aluno.id,
            professorId: professor.id
        }
    })

    await prisma.treinoExercicio.create({
        data: {
            treinoId: treino.id,
            exercicioId: exercicio.id,
            series: 3,
            repeticoes: 10,
            carga: 40,
            descanso: 60,
            observacao: "Controle do movimento",
            ordem: 1
        }
    })

}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())