require("dotenv").config()

const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

const alunos = [
    { matricula: "1001", nome: "Lucas Andrade",   email: "lucas@academia.com"   },
    { matricula: "1002", nome: "Marina Costa",    email: "marina@academia.com"  },
    { matricula: "1003", nome: "Rafael Souza",    email: "rafael@academia.com"  },
    { matricula: "1004", nome: "Juliana Lima",    email: "juliana@academia.com" },
    { matricula: "1005", nome: "Bruno Mendes",    email: "bruno@academia.com"   },
    { matricula: "1006", nome: "Camila Ferreira", email: "camila@academia.com"  },
    { matricula: "1007", nome: "Diego Oliveira",  email: "diego@academia.com"   },
    { matricula: "1008", nome: "Fernanda Rocha",  email: "fernanda@academia.com"},
    { matricula: "1009", nome: "Gustavo Nunes",   email: "gustavo@academia.com" },
    { matricula: "1010", nome: "Helena Martins",  email: "helena@academia.com"  },
]

async function main() {
    for (const aluno of alunos) {
        await prisma.aluno.upsert({
            where:  { matricula: aluno.matricula },
            update: { nome: aluno.nome, email: aluno.email },
            create: aluno,
        })
    }

    console.log(`Seed concluído: ${alunos.length} alunos inseridos/atualizados.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
