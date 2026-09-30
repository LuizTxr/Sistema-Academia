-- CreateTable
CREATE TABLE "CredencialProfessor" (
    "professorId" INTEGER NOT NULL,
    "senhaHash" TEXT NOT NULL,

    CONSTRAINT "CredencialProfessor_pkey" PRIMARY KEY ("professorId")
);

-- AddForeignKey
ALTER TABLE "CredencialProfessor" ADD CONSTRAINT "CredencialProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
