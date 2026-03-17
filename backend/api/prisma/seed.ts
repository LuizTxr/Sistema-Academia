import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({
    adapter
})

async function main() {

    console.log("Seed iniciado...")

    const professor = await prisma.professor.create({
        data: {
            nome: "Carlos Silva",
            email: "carlos@academia.com",
            especialidade: "Musculação"
        }
    })

    const aluno = await prisma.aluno.create({
        data: {
            nome: "João Souza",
            email: "joao@academia.com",
            telefone: "11999999999"
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
            objetivo: "Condicionamento físico",
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
            ordem: 1,
            observacao: "Foco na execução"
        }
    })

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })