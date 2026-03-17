/*
  Warnings:

  - You are about to drop the column `telefone` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Exercicio` table. All the data in the column will be lost.
  - You are about to drop the column `equipamentoId` on the `Exercicio` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `especialidade` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `alunoId` on the `Treino` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `Treino` table. All the data in the column will be lost.
  - You are about to drop the column `objetivo` on the `Treino` table. All the data in the column will be lost.
  - The primary key for the `TreinoExercicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descanso` on the `TreinoExercicio` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `TreinoExercicio` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `TreinoExercicio` table. All the data in the column will be lost.
  - You are about to drop the column `ordem` on the `TreinoExercicio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercicio" DROP CONSTRAINT "Exercicio_equipamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Treino" DROP CONSTRAINT "Treino_alunoId_fkey";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "telefone";

-- AlterTable
ALTER TABLE "Exercicio" DROP COLUMN "descricao",
DROP COLUMN "equipamentoId";

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "createdAt",
DROP COLUMN "especialidade";

-- AlterTable
ALTER TABLE "Treino" DROP COLUMN "alunoId",
DROP COLUMN "dataCriacao",
DROP COLUMN "objetivo",
ADD COLUMN     "descricao" TEXT;

-- AlterTable
ALTER TABLE "TreinoExercicio" DROP CONSTRAINT "TreinoExercicio_pkey",
DROP COLUMN "descanso",
DROP COLUMN "id",
DROP COLUMN "observacoes",
DROP COLUMN "ordem",
ADD CONSTRAINT "TreinoExercicio_pkey" PRIMARY KEY ("treinoId", "exercicioId");

-- CreateTable
CREATE TABLE "ExercicioEquipamento" (
    "exercicioId" INTEGER NOT NULL,
    "equipamentoId" INTEGER NOT NULL,

    CONSTRAINT "ExercicioEquipamento_pkey" PRIMARY KEY ("exercicioId","equipamentoId")
);

-- AddForeignKey
ALTER TABLE "ExercicioEquipamento" ADD CONSTRAINT "ExercicioEquipamento_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicioEquipamento" ADD CONSTRAINT "ExercicioEquipamento_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
