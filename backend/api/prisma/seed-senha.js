// Senha padrao dos professores criados pelas seeds. Somente para desenvolvimento.
// O formato do hash precisa ser o mesmo de src/auth/senha.ts.
const { randomBytes, scryptSync } = require('node:crypto')

const SENHA_PADRAO_PROFESSOR = process.env.SEED_SENHA_PROFESSOR || 'professor123'

function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString('hex')
  const chave = scryptSync(senha, sal, 64).toString('hex')

  return `scrypt$${sal}$${chave}`
}

async function criarCredencialProfessor(prisma, professor) {
  await prisma.credencialProfessor.create({
    data: {
      professorId: professor.id,
      senhaHash: gerarHashSenha(SENHA_PADRAO_PROFESSOR),
    },
  })
}

module.exports = { SENHA_PADRAO_PROFESSOR, criarCredencialProfessor }
