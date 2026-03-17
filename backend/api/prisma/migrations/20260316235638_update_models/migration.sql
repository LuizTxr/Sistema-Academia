/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Equipamento` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `Treino` table. All the data in the column will be lost.
  - The primary key for the `TreinoExercicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ExercicioEquipamento` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `tipo` on table `Equipamento` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `equipamentoId` to the `Exercicio` table without a default value. This is not possible if the table is not empty.
  - Made the column `grupoMuscular` on table `Exercicio` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `alunoId` to the `Treino` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objetivo` to the `Treino` table without a default value. This is not possible if the table is not empty.
  - Made the column `series` on table `TreinoExercicio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repeticoes` on table `TreinoExercicio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExercicioEquipamento" DROP CONSTRAINT "ExercicioEquipamento_equipamentoId_fkey";

-- DropForeignKey
ALTER TABLE "ExercicioEquipamento" DROP CONSTRAINT "ExercicioEquipamento_exercicioId_fkey";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "createdAt",
ADD COLUMN     "telefone" TEXT;

-- AlterTable
ALTER TABLE "Equipamento" DROP COLUMN "descricao",
ALTER COLUMN "tipo" SET NOT NULL;

-- AlterTable
ALTER TABLE "Exercicio" ADD COLUMN     "equipamentoId" INTEGER NOT NULL,
ALTER COLUMN "grupoMuscular" SET NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "especialidade" TEXT;

-- AlterTable
ALTER TABLE "Treino" DROP COLUMN "descricao",
ADD COLUMN     "alunoId" INTEGER NOT NULL,
ADD COLUMN     "objetivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TreinoExercicio" DROP CONSTRAINT "TreinoExercicio_pkey",
ADD COLUMN     "descanso" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "ordem" INTEGER,
ALTER COLUMN "series" SET NOT NULL,
ALTER COLUMN "repeticoes" SET NOT NULL,
ADD CONSTRAINT "TreinoExercicio_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ExercicioEquipamento";

-- AddForeignKey
ALTER TABLE "Exercicio" ADD CONSTRAINT "Exercicio_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treino" ADD CONSTRAINT "Treino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
