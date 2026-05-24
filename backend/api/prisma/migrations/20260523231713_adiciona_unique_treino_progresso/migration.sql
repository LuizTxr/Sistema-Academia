-- CreateTable
CREATE TABLE "ProgressoTreino" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "treinoId" INTEGER NOT NULL,
    "seriesConcluidas" TEXT[],
    "exerciciosConcluidos" TEXT[],
    "salvoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressoTreino_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoTreino_treinoId_key" ON "ProgressoTreino"("treinoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoTreino_alunoId_treinoId_key" ON "ProgressoTreino"("alunoId", "treinoId");

-- AddForeignKey
ALTER TABLE "ProgressoTreino" ADD CONSTRAINT "ProgressoTreino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoTreino" ADD CONSTRAINT "ProgressoTreino_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
